"""Penyimpanan sederhana dengan SQLite bawaan Python (tanpa ORM).

Tabel:
- queries      : setiap pencarian (untuk statistik dan menautkan umpan balik)
- feedback     : jawaban "cocok / tidak cocok" dari pengguna
- custom_motifs: motif yang ditambahkan admin lewat API
- uploads      : gambar galeri tambahan untuk motif (fitur tambah koleksi)
"""
from __future__ import annotations

import sqlite3
import threading
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS queries (
    id         TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    model      TEXT NOT NULL,
    tebakan    TEXT,
    skor       REAL,
    yakin      INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS feedback (
    query_id   TEXT PRIMARY KEY REFERENCES queries(id),
    cocok      INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    selesai    INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS custom_motifs (
    id         TEXT PRIMARY KEY,
    nama       TEXT NOT NULL,
    daerah     TEXT NOT NULL,
    ciri       TEXT NOT NULL DEFAULT '',
    deskripsi  TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS uploads (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    motif_id   TEXT NOT NULL,
    path       TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Store:
    def __init__(self, path: Path):
        path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(str(path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._lock = threading.Lock()
        with self._tx() as c:
            c.executescript(SCHEMA)
            # Migrasi untuk database lama yang dibuat sebelum kolom `selesai` ada
            cols = {r[1] for r in c.execute("PRAGMA table_info(feedback)")}
            if "selesai" not in cols:
                c.execute("ALTER TABLE feedback ADD COLUMN selesai INTEGER NOT NULL DEFAULT 0")

    @contextmanager
    def _tx(self):
        with self._lock:
            try:
                yield self._conn
                self._conn.commit()
            except Exception:
                self._conn.rollback()
                raise

    def close(self) -> None:
        self._conn.close()

    # --- queries & feedback -------------------------------------------------
    def add_query(self, query_id: str, model: str, tebakan: str | None, skor: float | None, yakin: bool) -> None:
        with self._tx() as c:
            c.execute(
                "INSERT INTO queries VALUES (?, ?, ?, ?, ?, ?)",
                (query_id, _now(), model, tebakan, skor, int(yakin)),
            )

    def query_exists(self, query_id: str) -> bool:
        with self._tx() as c:
            return c.execute("SELECT 1 FROM queries WHERE id = ?", (query_id,)).fetchone() is not None

    def set_feedback(self, query_id: str, cocok: bool) -> None:
        """Satu umpan balik per pencarian; kalau dikirim ulang, jawaban terakhir yang dipakai."""
        with self._tx() as c:
            c.execute(
                "INSERT INTO feedback (query_id, cocok, created_at) VALUES (?, ?, ?) "
                "ON CONFLICT(query_id) DO UPDATE SET cocok = excluded.cocok, created_at = excluded.created_at, selesai = 0",
                (query_id, int(cocok), _now()),
            )

    def list_feedback(self, limit: int = 100, termasuk_selesai: bool = False) -> list[dict]:
        """Umpan balik terbaru beserta hasil pencariannya (motif tebakan, skor, model)."""
        where = "" if termasuk_selesai else "WHERE f.selesai = 0"
        with self._tx() as c:
            rows = c.execute(
                f"SELECT f.query_id, f.cocok, f.created_at, f.selesai, q.tebakan, q.skor, q.model, q.yakin "
                f"FROM feedback f JOIN queries q ON q.id = f.query_id {where} "
                f"ORDER BY f.created_at DESC LIMIT ?",
                (limit,),
            ).fetchall()
        return [
            {**dict(r), "cocok": bool(r["cocok"]), "selesai": bool(r["selesai"]), "yakin": bool(r["yakin"])}
            for r in rows
        ]

    def mark_feedback_done(self, query_id: str) -> bool:
        with self._tx() as c:
            return c.execute("UPDATE feedback SET selesai = 1 WHERE query_id = ?", (query_id,)).rowcount > 0

    def stats(self) -> dict:
        with self._tx() as c:
            total = c.execute("SELECT COUNT(*) FROM queries").fetchone()[0]
            pos = c.execute("SELECT COUNT(*) FROM feedback WHERE cocok = 1").fetchone()[0]
            neg = c.execute("SELECT COUNT(*) FROM feedback WHERE cocok = 0").fetchone()[0]
            tidak_dikenal = c.execute("SELECT COUNT(*) FROM queries WHERE yakin = 0").fetchone()[0]
        return {
            "total_queries": total,
            "feedback_positif": pos,
            "feedback_negatif": neg,
            "pencarian_tidak_dikenal": tidak_dikenal,
        }

    # --- motif tambahan -----------------------------------------------------
    def list_custom_motifs(self) -> list[dict]:
        with self._tx() as c:
            rows = c.execute(
                "SELECT id, nama, daerah, ciri, deskripsi FROM custom_motifs ORDER BY created_at"
            ).fetchall()
        return [dict(r) for r in rows]

    def add_custom_motif(self, m: dict) -> None:
        with self._tx() as c:
            c.execute(
                "INSERT INTO custom_motifs VALUES (?, ?, ?, ?, ?, ?)",
                (m["id"], m["nama"], m["daerah"], m.get("ciri", ""), m.get("deskripsi", ""), _now()),
            )

    def delete_custom_motif(self, motif_id: str) -> list[str]:
        """Hapus motif tambahan beserta catatan gambarnya. Mengembalikan path gambar yang perlu dihapus."""
        with self._tx() as c:
            paths = [r[0] for r in c.execute("SELECT path FROM uploads WHERE motif_id = ?", (motif_id,))]
            c.execute("DELETE FROM uploads WHERE motif_id = ?", (motif_id,))
            c.execute("DELETE FROM custom_motifs WHERE id = ?", (motif_id,))
        return paths

    # --- gambar galeri tambahan ----------------------------------------------
    def add_upload(self, motif_id: str, path: str) -> None:
        with self._tx() as c:
            c.execute("INSERT INTO uploads (motif_id, path, created_at) VALUES (?, ?, ?)", (motif_id, path, _now()))

    def list_uploads(self) -> list[tuple[str, str]]:
        with self._tx() as c:
            return [(r[0], r[1]) for r in c.execute("SELECT motif_id, path FROM uploads ORDER BY id")]
