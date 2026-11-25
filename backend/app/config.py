"""Konfigurasi aplikasi, dibaca dari environment / file .env.

Semua path relatif dihitung dari folder `backend/`, jadi server bisa dijalankan
dari folder mana pun.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent
REPO_DIR = BACKEND_DIR.parent

load_dotenv(BACKEND_DIR / ".env")


def _path(name: str, default: str) -> Path:
    p = Path(os.getenv(name, default))
    return p if p.is_absolute() else (BACKEND_DIR / p).resolve()


def _list(name: str, default: str) -> list[str]:
    return [x.strip() for x in os.getenv(name, default).split(",") if x.strip()]


@dataclass
class Settings:
    app_env: str = field(default_factory=lambda: os.getenv("APP_ENV", "development"))

    # Lokasi data
    database_path: Path = field(default_factory=lambda: _path("DATABASE_PATH", "./batikmatch.db"))
    artifacts_dir: Path = field(default_factory=lambda: _path("ARTIFACTS_DIR", "../artifacts"))
    outputs_dir: Path = field(default_factory=lambda: _path("OUTPUTS_DIR", "../outputs"))
    # Folder dataset (berisi TRAIN/ dan TEST/). Path di manifest model relatif ke folder ini.
    data_dir: Path = field(default_factory=lambda: _path("DATA_DIR", "../data/raw"))
    # Galeri untuk model histogram dan gambar /images/{id}. Default: DATA_DIR/TRAIN.
    gallery_dir: Path = field(default_factory=lambda: _path("GALLERY_DIR", "../data/raw/TRAIN"))
    upload_dir: Path = field(default_factory=lambda: _path("UPLOAD_DIR", "./uploads"))

    # Pencarian
    default_model: str = field(default_factory=lambda: os.getenv("DEFAULT_MODEL", ""))
    threshold_yakin: float = field(default_factory=lambda: float(os.getenv("THRESHOLD_YAKIN", "0.70")))
    label_sangat_mirip: float = field(default_factory=lambda: float(os.getenv("LABEL_SANGAT_MIRIP", "0.85")))
    label_cukup_mirip: float = field(default_factory=lambda: float(os.getenv("LABEL_CUKUP_MIRIP", "0.70")))
    default_top_k: int = field(default_factory=lambda: int(os.getenv("DEFAULT_TOP_K", "3")))
    max_top_k: int = field(default_factory=lambda: int(os.getenv("MAX_TOP_K", "15")))

    # Upload
    max_upload_mb: float = field(default_factory=lambda: float(os.getenv("MAX_UPLOAD_MB", "5")))
    allowed_types: list[str] = field(
        default_factory=lambda: _list("ALLOWED_TYPES", "image/jpeg,image/png,image/webp")
    )

    # Admin
    admin_username: str = field(default_factory=lambda: os.getenv("ADMIN_USERNAME", "admin"))
    admin_password: str = field(default_factory=lambda: os.getenv("ADMIN_PASSWORD", "admin"))
    secret_key: str = field(default_factory=lambda: os.getenv("SECRET_KEY", "ganti-ini-di-produksi"))
    token_hours: float = field(default_factory=lambda: float(os.getenv("TOKEN_HOURS", "12")))

    cors_origins: list[str] = field(
        default_factory=lambda: _list("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    )
    # Saat development, izinkan localhost di port mana pun (Vite kadang pindah ke 5174, dst.)
    cors_allow_localhost: bool = field(
        default_factory=lambda: os.getenv("CORS_ALLOW_LOCALHOST", "true").lower() == "true"
    )

    @property
    def max_upload_bytes(self) -> int:
        return int(self.max_upload_mb * 1024 * 1024)


settings = Settings()
