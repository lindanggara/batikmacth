"""Inferensi untuk backend: foto masuk, motif paling mirip keluar.

Pemakaian di backend (muat sekali saat server mulai):
    from ml.inference import BatikRetriever
    retriever = BatikRetriever()
    hasil = retriever.search(bytes_gambar, top_k=5)
"""
import io
import json
from pathlib import Path

import numpy as np
import pandas as pd
import torch
from PIL import Image, ImageOps

from .embedding import embed_image, load_model
from .search import search_from_embedding

ROOT = Path(__file__).resolve().parents[1]


def _to_pil(image) -> Image.Image:
    """Menerima PIL Image, bytes (upload), atau path file. Orientasi EXIF foto HP dikoreksi."""
    if isinstance(image, Image.Image):
        img = image
    elif isinstance(image, (bytes, bytearray)):
        img = Image.open(io.BytesIO(image))
    else:
        img = Image.open(image)
    return ImageOps.exif_transpose(img).convert("RGB")


class BatikRetriever:
    def __init__(self, artifacts_dir=None, device=None, min_similarity=None):
        art = Path(artifacts_dir) if artifacts_dir else ROOT / "artifacts"
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.min_similarity = min_similarity     # ambang 'motif tidak dikenal' (harus dikalibrasi)

        self.cfg = json.load(open(art / "final_config.json"))
        self.gallery_df = pd.read_csv(art / "embeddings" / "final_gallery_manifest.csv")
        self.gallery = np.load(art / "embeddings" / "final_gallery.npy")
        assert len(self.gallery_df) == len(self.gallery), "manifest galeri dan embedding tidak sama panjang"

        self.classes = sorted(set(self.gallery_df["class"].tolist()))
        self.model = load_model(art / "models" / "final.pt", self.cfg["backbone"], len(self.classes), self.device)

    def embed(self, image) -> np.ndarray:
        return embed_image(self.model, _to_pil(image), self.device)

    def search(self, image, top_k: int = 5) -> dict:
        """Mengembalikan {'predicted_class', 'top1_similarity', 'unknown', 'results': [...]}.
        Setiap item results berisi rank, class, similarity, dan path (relatif terhadap data/raw)."""
        return search_from_embedding(self.embed(image), self.gallery, self.gallery_df,
                                     top_k=top_k, min_similarity=self.min_similarity)

    def info(self) -> dict:
        return {"backbone": self.cfg["backbone"], "tag": self.cfg["tag"], "n_gallery": len(self.gallery),
                "n_classes": len(self.classes), "embedding_dim": int(self.gallery.shape[1]),
                "device": self.device}
