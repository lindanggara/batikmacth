"""Katalog info motif: data bawaan (data/motifs.json) + motif tambahan dari admin."""
from __future__ import annotations

import json
import re
from pathlib import Path

from .store import Store

BUILTIN_PATH = Path(__file__).resolve().parent / "data" / "motifs.json"


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


class Catalog:
    def __init__(self, store: Store):
        self._store = store
        self._builtin: list[dict] = json.loads(BUILTIN_PATH.read_text(encoding="utf-8"))
        self._builtin_ids = {m["id"] for m in self._builtin}

    def all(self) -> list[dict]:
        custom = [{**m, "tambahan": True} for m in self._store.list_custom_motifs()]
        return [{**m, "tambahan": False} for m in self._builtin] + custom

    def get(self, motif_id: str) -> dict | None:
        return next((m for m in self.all() if m["id"] == motif_id), None)

    def is_builtin(self, motif_id: str) -> bool:
        return motif_id in self._builtin_ids

    def ids(self) -> set[str]:
        return {m["id"] for m in self.all()}

    def label_map(self) -> dict[str, str]:
        """Peta nama folder/kelas dataset -> id motif. Contoh: "Batik Ikat Celup" -> "celup".
        ID dan nama motif juga dikenali, jadi folder bernama "kawung" atau "Kawung" tetap cocok."""
        out: dict[str, str] = {}
        for m in self.all():
            for key in (m["id"], m.get("label", ""), m["nama"]):
                if key:
                    out[key.lower()] = m["id"]
        return out

    def resolve(self, label: str) -> str:
        """Ubah nama kelas dari dataset/manifest jadi id motif. Kalau tidak dikenal, pakai slug-nya."""
        return self.label_map().get(label.lower(), slugify(label))
