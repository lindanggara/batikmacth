"""Model dan ekstraksi embedding. Sama persis dengan notebook 02, 03, dan 04."""
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torch.utils.data import DataLoader, Dataset
from torchvision import models, transforms

IMG_SIZE = 224
MEAN, STD = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]


def get_transforms(img_size: int = IMG_SIZE, is_train: bool = False):
    """Transformasi gambar. Mode latih = augmentasi yang dipakai di notebook 03."""
    if is_train:
        return transforms.Compose([
            transforms.RandomResizedCrop(img_size, scale=(0.6, 1.0)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(0.2, 0.2, 0.2, 0.02),
            transforms.ToTensor(),
            transforms.Normalize(MEAN, STD),
        ])
    return transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(MEAN, STD),
    ])


class ImageDataset(Dataset):
    """df berisi kolom `path` (relatif terhadap data_dir) dan, untuk training, `class`."""

    def __init__(self, df, data_dir, transform=None, class_to_idx=None):
        self.paths = df["path"].tolist()
        self.data_dir = Path(data_dir)
        self.transform = transform or get_transforms(is_train=False)
        self.labels = None
        if class_to_idx is not None:
            self.labels = [class_to_idx[c] for c in df["class"].tolist()]

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, i):
        img = Image.open(self.data_dir / self.paths[i]).convert("RGB")
        x = self.transform(img)
        return x if self.labels is None else (x, int(self.labels[i]))


def make_loader(df, data_dir, class_to_idx=None, is_train=False, batch_size=32,
                shuffle=False, drop_last=False, num_workers=0):
    ds = ImageDataset(df, data_dir, get_transforms(is_train=is_train), class_to_idx)
    return DataLoader(ds, batch_size=batch_size, shuffle=shuffle,
                      drop_last=drop_last, num_workers=num_workers)


def _make_backbone(model_name: str, pretrained: bool = True):
    """Backbone CNN tanpa layer klasifikasi asli. Keluarannya adalah embedding."""
    if model_name == "resnet50":
        w = models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None
        m = models.resnet50(weights=w)
        dim = m.fc.in_features
        m.fc = nn.Identity()
    elif model_name == "mobilenet_v2":
        w = models.MobileNet_V2_Weights.IMAGENET1K_V2 if pretrained else None
        m = models.mobilenet_v2(weights=w)
        dim = m.classifier[1].in_features
        m.classifier = nn.Identity()
    elif model_name == "efficientnet_b0":
        w = models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
        m = models.efficientnet_b0(weights=w)
        dim = m.classifier[1].in_features
        m.classifier = nn.Identity()
    else:
        raise ValueError(f"Model tidak didukung: {model_name}")
    return m, dim


def build_backbone(model_name: str = "efficientnet_b0", pretrained: bool = True, device: str = "cpu"):
    """Backbone pretrained saja (untuk baseline tanpa fine-tuning). Mengembalikan (model, dimensi)."""
    m, dim = _make_backbone(model_name, pretrained)
    return m.to(device).eval(), dim


class RetrievalNet(nn.Module):
    """Backbone + head klasifikasi. Nama atribut sama dengan notebook, jadi final.pt bisa dimuat langsung."""

    def __init__(self, name: str, n_classes: int, pretrained: bool = True):
        super().__init__()
        self.name = name
        self.backbone, dim = _make_backbone(name, pretrained)
        self.head = nn.Sequential(nn.Dropout(0.2), nn.Linear(dim, n_classes))

    def embed(self, x):          # embedding untuk retrieval (sebelum head)
        return self.backbone(x)

    def forward(self, x):        # logit untuk training
        return self.head(self.backbone(x))


def load_model(checkpoint_path, backbone: str, n_classes: int, device: str = "cpu"):
    """Memuat bobot final. Pemuatan ketat (strict): kalau kunci tidak cocok, langsung error."""
    net = RetrievalNet(backbone, n_classes, pretrained=False).to(device)
    state = torch.load(checkpoint_path, map_location=device, weights_only=True)
    net.load_state_dict(state)
    return net.eval()


@torch.no_grad()
def extract_embeddings(model, dataloader, device: str = "cpu") -> np.ndarray:
    """Embedding seluruh isi dataloader, dinormalisasi L2. Model boleh RetrievalNet atau backbone."""
    embed = model.embed if hasattr(model, "embed") else model
    model.eval()
    out = []
    for batch in dataloader:
        imgs = batch[0] if isinstance(batch, (list, tuple)) else batch
        out.append(F.normalize(embed(imgs.to(device)), p=2, dim=1).cpu().numpy())
    return np.vstack(out)


@torch.no_grad()
def embed_image(model, image: Image.Image, device: str = "cpu") -> np.ndarray:
    """Embedding satu gambar PIL (vektor 1 dimensi, L2-normal)."""
    model.eval()
    x = get_transforms(is_train=False)(image.convert("RGB")).unsqueeze(0).to(device)
    return F.normalize(model.embed(x), p=2, dim=1).cpu().numpy()[0]
