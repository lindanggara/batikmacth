import os
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from embedding import build_backbone, get_transforms, ImageDataset, extract_embeddings
from evaluate import evaluate_retrieval


class RetrievalClassifier(nn.Module):
    """Wrapper backbone + classification head untuk fine-tuning metric/classification."""
    def __init__(self, model_name: str, num_classes: int, pretrained: bool = True):
        super().__init__()
        self.backbone, feat_dim = build_backbone(model_name=model_name, pretrained=pretrained)
        self.head = nn.Linear(feat_dim, num_classes)

    def forward(self, x):
        emb = self.backbone(x)
        logits = self.head(emb)
        return logits, F.normalize(emb, p=2, dim=1)


def train_model(
    train_df,
    val_df,
    model_name: str = "efficientnet_b0",
    epochs: int = 10,
    batch_size: int = 32,
    lr: float = 1e-4,
    save_path: str = "best_model.pth",
    device: str = None
):
    """Melakukan fine-tuning backbone dan menyimpan bobot dengan mAP validasi terbaik."""
    if device is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"

    classes = sorted(train_df["class"].unique())
    class_to_idx = {c: idx for idx, c in enumerate(classes)}

    train_ds = ImageDataset(train_df, transform=get_transforms(is_train=True), class_to_idx=class_to_idx)
    gallery_eval_ds = ImageDataset(train_df, transform=get_transforms(is_train=False), class_to_idx=class_to_idx)
    val_ds = ImageDataset(val_df, transform=get_transforms(is_train=False), class_to_idx=class_to_idx)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=2)
    gallery_loader = DataLoader(gallery_eval_ds, batch_size=batch_size, shuffle=False, num_workers=2)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=2)

    model = RetrievalClassifier(model_name=model_name, num_classes=len(classes), pretrained=True).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)

    best_map = -1.0
    gallery_labels = train_df["class"].values
    val_labels = val_df["class"].values

    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(device), labels.to(device)
            optimizer.zero_grad()
            logits, _ = model(imgs)
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item() * imgs.size(0)

        avg_loss = total_loss / len(train_ds)

        # Evaluasi retrieval pada setiap akhir epoch
        gallery_embs = extract_embeddings(model.backbone, gallery_loader, device=device)
        val_embs = extract_embeddings(model.backbone, val_loader, device=device)
        metrics = evaluate_retrieval(val_embs, val_labels, gallery_embs, gallery_labels, ks=(5, 10))

        print(
            f"Epoch [{epoch}/{epochs}] | Loss: {avg_loss:.4f} | "
            f"P@5: {metrics['P@5']:.4f} | P@10: {metrics['P@10']:.4f} | mAP: {metrics['mAP']:.4f}"
        )

        if metrics["mAP"] > best_map:
            best_map = metrics["mAP"]
            os.makedirs(os.path.dirname(save_path) or ".", exist_ok=True)
            torch.save(model.state_dict(), save_path)

    return model, best_map
