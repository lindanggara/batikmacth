import os
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import models, transforms
from PIL import Image
import numpy as np


def get_transforms(img_size: int = 224, is_train: bool = False):
    """Mengembalikan transformasi gambar sesuai standar ImageNet."""
    if is_train:
        return transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomRotation(degrees=15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
    return transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])


class ImageDataset(Dataset):
    """Dataset citra untuk ekstraksi fitur maupun pelatihan."""
    def __init__(self, df, transform=None, class_to_idx=None):
        self.df = df.reset_index(drop=True)
        self.transform = transform
        self.class_to_idx = class_to_idx

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        img = Image.open(row["path"]).convert("RGB")
        if self.transform:
            img = self.transform(img)
        
        if self.class_to_idx is not None and "class" in row:
            label = self.class_to_idx[row["class"]]
            return img, label
        return img, row["path"]


def build_backbone(model_name: str = "efficientnet_b0", pretrained: bool = True, checkpoint_path: str = None, device: str = "cpu"):
    """Membangun backbone CNN (ResNet50, MobileNetV2, atau EfficientNet-B0) sebagai feature extractor."""
    if model_name == "resnet50":
        weights = models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None
        model = models.resnet50(weights=weights)
        feat_dim = model.fc.in_features
        model.fc = nn.Identity()
    elif model_name == "mobilenet_v2":
        weights = models.MobileNet_V2_Weights.IMAGENET1K_V2 if pretrained else None
        model = models.mobilenet_v2(weights=weights)
        feat_dim = model.classifier[-1].in_features
        model.classifier = nn.Identity()
    elif model_name == "efficientnet_b0":
        weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
        model = models.efficientnet_b0(weights=weights)
        feat_dim = model.classifier[-1].in_features
        model.classifier = nn.Identity()
    else:
        raise ValueError(f"Model tidak didukung: {model_name}")

    if checkpoint_path and os.path.exists(checkpoint_path):
        state = torch.load(checkpoint_path, map_location=device)
        # Mendukung loading state_dict dari model full classifier maupun backbone murni
        backbone_state = {
            k.replace("backbone.", ""): v
            for k, v in state.items()
            if not k.startswith("head.") and not k.startswith("fc.") and not k.startswith("classifier.")
        }
        model.load_state_dict(backbone_state, strict=False)

    model = model.to(device)
    model.eval()
    return model, feat_dim


@torch.no_grad()
def extract_embeddings(model, dataloader, device: str = "cpu") -> np.ndarray:
    """Mengekstrak embedding dan melakukan Normalisasi L2."""
    model.eval()
    all_embs = []
    for imgs, _ in dataloader:
        imgs = imgs.to(device)
        feats = model(imgs)
        feats = F.normalize(feats, p=2, dim=1)
        all_embs.append(feats.cpu().numpy())
    return np.vstack(all_embs)
