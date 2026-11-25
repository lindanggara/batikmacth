"""Akses ke objek bersama (dimuat sekali di lifespan) dan helper validasi upload."""
from __future__ import annotations

import io

from fastapi import HTTPException, Request, UploadFile
from PIL import Image, UnidentifiedImageError

from .catalog import Catalog
from .config import settings
from .engine import SearchEngine
from .store import Store


def get_engine(request: Request) -> SearchEngine:
    return request.app.state.engine


def get_store(request: Request) -> Store:
    return request.app.state.store


def get_catalog(request: Request) -> Catalog:
    return request.app.state.catalog


async def read_image(file: UploadFile) -> tuple[Image.Image, bytes]:
    """Validasi tipe dan ukuran, lalu buka gambarnya. Pesan error dalam bahasa Indonesia untuk ditampilkan frontend."""
    if file.content_type not in settings.allowed_types:
        raise HTTPException(415, "File harus berupa gambar JPG, PNG, atau WEBP.")
    data = await file.read(settings.max_upload_bytes + 1)
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(413, f"Ukuran gambar maksimal {settings.max_upload_mb:g} MB.")
    if not data:
        raise HTTPException(400, "File gambar kosong.")
    try:
        with Image.open(io.BytesIO(data)) as im:
            im.load()
            image = im.convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(400, "Gambar tidak bisa dibaca. Coba foto atau file lain.")
    if min(image.size) < 32:
        raise HTTPException(400, "Gambar terlalu kecil. Gunakan foto minimal 32x32 piksel.")
    return image, data


def motif_out(m: dict, engine: SearchEngine) -> dict:
    """Lengkapi data motif dengan URL gambar dan jumlah gambar galeri."""
    count = engine.counts().get(m["id"], 0)
    return {
        **m,
        "gambar": f"/images/{m['id']}" if count else None,
        "jumlah_gambar": count,
    }
