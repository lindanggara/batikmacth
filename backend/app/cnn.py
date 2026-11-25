"""Pemuat model CNN. Arsitekturnya disalin dari notebooks/03_finetuning.ipynb (kelas Net)
supaya file `artifacts/models/final.pt` bisa dimuat apa adanya.

torch hanya di-import di sini, jadi backend tetap bisa jalan (dengan model histogram)
walaupun torch belum terpasang.
"""
from __future__ import annotations

from pathlib import Path
from typing import Callable

import numpy as np
from PIL import Image

ARCH_NAMES = {
    "resnet50": "ResNet50",
    "mobilenet_v2": "MobileNetV2",
    "efficientnet_b0": "EfficientNet-B0",
}


def _backbone(arch: str, pretrained: bool):
    import torch.nn as nn
    from torchvision import models

    if arch == "resnet50":
        b = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None)
        dim = b.fc.in_features
        b.fc = nn.Identity()
    elif arch == "mobilenet_v2":
        b = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V2 if pretrained else None)
        dim = b.classifier[1].in_features
        b.classifier = nn.Identity()
    elif arch == "efficientnet_b0":
        b = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None)
        dim = b.classifier[1].in_features
        b.classifier = nn.Identity()
    else:
        raise ValueError(f"Arsitektur tidak dikenal: {arch}")
    return b, dim


def _transform(img_size: int = 224):
    from torchvision import transforms

    return transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])


def _extractor(backbone, img_size: int) -> Callable[[Image.Image], np.ndarray]:
    import torch

    tfm = _transform(img_size)
    backbone.eval()

    def extract(image: Image.Image) -> np.ndarray:
        with torch.inference_mode():
            x = tfm(image.convert("RGB")).unsqueeze(0)
            return backbone(x)[0].cpu().numpy().astype(np.float32)

    return extract


def load_finetuned(arch: str, weights_path: Path, img_size: int = 224) -> Callable[[Image.Image], np.ndarray]:
    """Muat state_dict kelas Net (backbone.* + head.*), lalu pakai backbone-nya sebagai pengekstrak embedding."""
    import torch
    import torch.nn as nn

    state = torch.load(weights_path, map_location="cpu", weights_only=True)
    n_classes = state["head.1.weight"].shape[0]

    class Net(nn.Module):
        def __init__(self):
            super().__init__()
            self.backbone, dim = _backbone(arch, pretrained=False)  # bobot diambil dari final.pt, tidak perlu unduh
            self.head = nn.Sequential(nn.Dropout(0.2), nn.Linear(dim, n_classes))

    net = Net()
    net.load_state_dict(state)
    return _extractor(net.backbone, img_size)


def load_pretrained(arch: str, img_size: int = 224) -> Callable[[Image.Image], np.ndarray]:
    """Backbone ImageNet tanpa fine-tuning (notebook 02). Bobot diunduh torchvision saat pertama kali."""
    backbone, _ = _backbone(arch, pretrained=True)
    return _extractor(backbone, img_size)
