"""Mesin pencarian: ubah gambar jadi embedding, lalu cari motif termirip dengan cosine similarity.

Model yang dimuat (semuanya SEKALI saat server mulai, lihat lifespan di main.py):

1. "histogram" — selalu ada
   Baseline non-neural: histogram warna HSV. Embedding galerinya dihitung saat server mulai
   dari gambar di GALLERY_DIR (default data/raw/TRAIN).

2. "<arsitektur>_finetuned" — kalau file dari notebooks/03_finetuning.ipynb ada:
       artifacts/final_config.json                       # berisi "backbone", mis. "efficientnet_b0"
       artifacts/models/final.pt                         # state_dict kelas Net
       artifacts/embeddings/final_gallery.npy            # (N, D)
       artifacts/embeddings/final_gallery_manifest.csv   # kolom: path, class, split (N baris, urutan sama)

3. "<arsitektur>_pretrained" — kalau file dari notebooks/02_ekstraksi_fitur.ipynb ada:
       artifacts/embeddings/<arsitektur>_gallery_pretrained.npy
       artifacts/embeddings/gallery_paths.json           # list path, urutan sama dengan baris npy
   Bobot ImageNet diunduh torchvision saat pertama kali (butuh internet sekali).

Threshold "motif tidak dikenal" per model bisa diatur di artifacts/thresholds.json,
mis. {"efficientnet_b0_finetuned": 0.62, "histogram": 0.9}. Kalau tidak ada, pakai THRESHOLD_YAKIN.
"""
from __future__ import annotations

import csv
import json
import logging
import threading
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable

import numpy as np
from PIL import Image

from .config import settings

log = logging.getLogger("batikmatch.engine")

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
Resolver = Callable[[str], str]


# --------------------------------------------------------------------------
# Ekstraktor baseline
# --------------------------------------------------------------------------
def histogram_embedding(image: Image.Image, bins: tuple[int, int, int] = (12, 4, 4)) -> np.ndarray:
    """Histogram warna HSV 3D yang dinormalisasi (12x4x4 = 192 dimensi)."""
    hsv = np.asarray(image.convert("RGB").resize((256, 256)).convert("HSV")).reshape(-1, 3)
    hist, _ = np.histogramdd(hsv, bins=bins, range=((0, 256), (0, 256), (0, 256)))
    vec = hist.astype(np.float32).ravel()
    return np.sqrt(vec / max(vec.sum(), 1.0))  # akar (Hellinger) agar warna dominan tidak terlalu berkuasa


def _l2norm(m: np.ndarray) -> np.ndarray:
    m = np.atleast_2d(m).astype(np.float32)
    n = np.linalg.norm(m, axis=1, keepdims=True)
    return m / np.clip(n, 1e-12, None)


# --------------------------------------------------------------------------
# Galeri per model
# --------------------------------------------------------------------------
@dataclass
class ModelIndex:
    key: str
    nama: str
    jenis: str  # "baseline", "pretrained", atau "finetuned"
    extract: Callable[[Image.Image], np.ndarray]
    threshold: float
    motif_ids: list[str] = field(default_factory=list)
    files: list[Path] = field(default_factory=list)
    matrix: np.ndarray = field(default_factory=lambda: np.zeros((0, 1), dtype=np.float32))
    _lock: threading.Lock = field(default_factory=threading.Lock, repr=False)

    def embed(self, image: Image.Image) -> np.ndarray:
        return _l2norm(self.extract(image))[0]

    def add(self, motif_id: str, path: Path, vec: np.ndarray) -> None:
        vec = _l2norm(vec)
        with self._lock:
            self.matrix = vec if self.matrix.shape[0] == 0 else np.vstack([self.matrix, vec])
            self.motif_ids.append(motif_id)
            self.files.append(path)

    def remove_motif(self, motif_id: str) -> None:
        with self._lock:
            keep = [i for i, m in enumerate(self.motif_ids) if m != motif_id]
            self.matrix = self.matrix[keep] if keep else self.matrix[:0]
            self.motif_ids = [self.motif_ids[i] for i in keep]
            self.files = [self.files[i] for i in keep]

    def rank_motifs(self, query_vec: np.ndarray, allowed: set[str] | None = None) -> list[tuple[str, float]]:
        """Skor tiap motif = kemiripan tertinggi di antara gambar-gambar motif itu."""
        with self._lock:
            if self.matrix.shape[0] == 0:
                return []
            sims = self.matrix @ query_vec
            ids = list(self.motif_ids)
        best: dict[str, float] = {}
        for mid, s in zip(ids, sims):
            if allowed is not None and mid not in allowed:
                continue
            if s > best.get(mid, -np.inf):
                best[mid] = float(s)
        return sorted(best.items(), key=lambda kv: kv[1], reverse=True)

    def counts(self) -> dict[str, int]:
        out: dict[str, int] = {}
        for m in self.motif_ids:
            out[m] = out.get(m, 0) + 1
        return out


def scan_gallery(root: Path, resolve: Resolver) -> list[tuple[str, Path]]:
    """Baca galeri dari folder. Mendukung dua struktur:
    - root/<kelas>/*.jpg   (struktur dataset, mis. data/raw/TRAIN/Batik Kawung/...)
    - root/<id>.jpg        (satu gambar per motif)
    Nama folder/file diubah jadi id motif lewat `resolve` (mis. "Batik Ikat Celup" -> "celup").
    """
    items: list[tuple[str, Path]] = []
    if not root.is_dir():
        return items
    for p in sorted(root.iterdir()):
        if p.is_dir():
            mid = resolve(p.name)
            items += [(mid, f) for f in sorted(p.rglob("*")) if f.suffix.lower() in IMAGE_EXTS]
        elif p.suffix.lower() in IMAGE_EXTS:
            items.append((resolve(p.stem), p))
    return items


def _open(path: Path) -> Image.Image:
    with Image.open(path) as im:
        return im.convert("RGB")


def _class_of(path: str) -> str:
    """'TRAIN/Batik Kawung/img.jpg' -> 'Batik Kawung'."""
    parts = Path(path).parts
    return parts[-2] if len(parts) >= 2 else ""


# --------------------------------------------------------------------------
# Mesin utama
# --------------------------------------------------------------------------
class SearchEngine:
    def __init__(self) -> None:
        self.models: dict[str, ModelIndex] = {}
        self.default_model: str = ""
        self.warnings: list[str] = []
        self._thresholds: dict[str, float] = {}

    def _threshold(self, key: str) -> float:
        return float(self._thresholds.get(key, settings.threshold_yakin))

    def load(self, uploads: list[tuple[str, str]], resolve: Resolver) -> None:
        f = settings.artifacts_dir / "thresholds.json"
        if f.exists():
            try:
                self._thresholds = json.loads(f.read_text(encoding="utf-8"))
            except Exception as e:
                self.warnings.append(f"thresholds.json tidak bisa dibaca: {e}")

        self._load_histogram(resolve)
        self._load_finetuned(resolve)
        self._load_pretrained(resolve)

        for key, idx in self.models.items():
            for motif_id, rel in uploads:
                path = settings.upload_dir / rel
                if path.exists():
                    try:
                        idx.add(motif_id, path, idx.extract(_open(path)))
                    except Exception as e:  # gambar rusak tidak boleh membuat server gagal start
                        log.warning("Gagal memuat upload %s untuk %s: %s", path, key, e)

        # Pemanasan: inferensi pertama torch biasanya lambat, lakukan sekarang supaya
        # permintaan pertama dari frontend (timeout 2,5 detik) tidak gagal.
        dummy = Image.new("RGB", (224, 224), (128, 128, 128))
        for key, idx in self.models.items():
            if idx.jenis != "baseline":
                try:
                    idx.embed(dummy)
                except Exception as e:
                    self.warnings.append(f"Model {key} gagal dijalankan: {e}")

        preferred = settings.default_model
        order = [k for j in ("finetuned", "pretrained") for k, m in self.models.items() if m.jenis == j]
        if preferred in self.models:
            self.default_model = preferred
        else:
            self.default_model = order[0] if order else "histogram"
        for w in self.warnings:
            log.warning(w)
        log.info("Model dimuat: %s (default: %s)", list(self.models), self.default_model)

    def _load_histogram(self, resolve: Resolver) -> None:
        idx = ModelIndex(key="histogram", nama="Histogram Warna (baseline)", jenis="baseline",
                         extract=histogram_embedding, threshold=self._threshold("histogram"))
        items = scan_gallery(settings.gallery_dir, resolve)
        if not items:
            self.warnings.append(
                f"Galeri kosong: {settings.gallery_dir}. Letakkan dataset di sana atau atur GALLERY_DIR di .env."
            )
        for motif_id, path in items:
            try:
                idx.add(motif_id, path, histogram_embedding(_open(path)))
            except Exception as e:
                log.warning("Lewati %s: %s", path, e)
        self.models["histogram"] = idx

    def _load_finetuned(self, resolve: Resolver) -> None:
        art = settings.artifacts_dir
        cfg_f = art / "final_config.json"
        weights = art / "models" / "final.pt"
        emb_f = art / "embeddings" / "final_gallery.npy"
        man_f = art / "embeddings" / "final_gallery_manifest.csv"
        present = [p.exists() for p in (cfg_f, weights, emb_f, man_f)]
        if not any(present):
            return
        if not all(present):
            self.warnings.append("Artefak fine-tuning tidak lengkap (butuh final_config.json, models/final.pt, "
                                 "embeddings/final_gallery.npy, embeddings/final_gallery_manifest.csv).")
            return
        try:
            from .cnn import ARCH_NAMES, load_finetuned

            cfg = json.loads(cfg_f.read_text(encoding="utf-8"))
            arch = cfg["backbone"]
            with man_f.open(encoding="utf-8") as fh:
                rows = list(csv.DictReader(fh))
            emb = np.load(emb_f)
            if len(rows) != emb.shape[0]:
                raise ValueError(f"manifest ({len(rows)}) dan embedding ({emb.shape[0]}) tidak sama panjang")
            key = f"{arch}_finetuned"
            self.models[key] = ModelIndex(
                key=key,
                nama=f"{ARCH_NAMES.get(arch, arch)} (fine-tuned)",
                jenis="finetuned",
                extract=load_finetuned(arch, weights, int(cfg.get("img_size", 224))),
                threshold=self._threshold(key),
                motif_ids=[resolve(r.get("class") or _class_of(r["path"])) for r in rows],
                files=[settings.data_dir / r["path"] for r in rows],
                matrix=_l2norm(emb),
            )
        except ImportError:
            self.warnings.append("Model fine-tuned ditemukan tapi torch belum terpasang: "
                                 "pip install -r requirements-ml.txt")
        except Exception as e:
            self.warnings.append(f"Gagal memuat model fine-tuned: {e}")

    def _load_pretrained(self, resolve: Resolver) -> None:
        emb_dir = settings.artifacts_dir / "embeddings"
        paths_f = emb_dir / "gallery_paths.json"
        files = sorted(emb_dir.glob("*_gallery_pretrained.npy")) if emb_dir.is_dir() else []
        if not files:
            return
        if not paths_f.exists():
            self.warnings.append("Embedding pretrained ditemukan tapi embeddings/gallery_paths.json tidak ada.")
            return
        try:
            from .cnn import ARCH_NAMES, load_pretrained
        except ImportError:
            self.warnings.append("Embedding pretrained ditemukan tapi torch belum terpasang.")
            return
        paths = json.loads(paths_f.read_text(encoding="utf-8"))
        for f in files:
            arch = f.name.removesuffix("_gallery_pretrained.npy")
            key = f"{arch}_pretrained"
            try:
                emb = np.load(f)
                if len(paths) != emb.shape[0]:
                    raise ValueError(f"gallery_paths.json ({len(paths)}) dan {f.name} ({emb.shape[0]}) tidak sama panjang")
                self.models[key] = ModelIndex(
                    key=key,
                    nama=f"{ARCH_NAMES.get(arch, arch)} (pretrained)",
                    jenis="pretrained",
                    extract=load_pretrained(arch),
                    threshold=self._threshold(key),
                    motif_ids=[resolve(_class_of(p)) for p in paths],
                    files=[settings.data_dir / p for p in paths],
                    matrix=_l2norm(emb),
                )
            except Exception as e:
                self.warnings.append(f"Gagal memuat {key}: {e}")

    def get(self, key: str | None) -> ModelIndex | None:
        return self.models.get(key or self.default_model)

    def add_image(self, motif_id: str, path: Path, image: Image.Image) -> None:
        for idx in self.models.values():
            idx.add(motif_id, path, idx.extract(image))

    def remove_motif(self, motif_id: str) -> None:
        for idx in self.models.values():
            idx.remove_motif(motif_id)

    def counts(self) -> dict[str, int]:
        """Jumlah gambar per motif di galeri model default (atau histogram kalau lebih lengkap)."""
        best: dict[str, int] = {}
        for idx in self.models.values():
            c = idx.counts()
            if sum(c.values()) > sum(best.values()):
                best = c
        return best

    def image_path(self, motif_id: str, i: int = 0) -> Path | None:
        """Gambar ke-i motif dari galeri yang file-nya benar-benar ada di disk."""
        for idx in sorted(self.models.values(), key=lambda m: m.jenis != "baseline"):
            files = [f for m, f in zip(idx.motif_ids, idx.files) if m == motif_id and f.exists()]
            if files:
                return files[i] if 0 <= i < len(files) else None
        return None
