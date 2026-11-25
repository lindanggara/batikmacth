"""Bentuk data request/response. Mengikuti yang sudah dipakai frontend."""
from __future__ import annotations

from pydantic import BaseModel, Field


class Motif(BaseModel):
    id: str = Field(examples=["kawung"])
    label: str = Field("", description="Nama kelas di dataset", examples=["Batik Kawung"])
    nama: str = Field(examples=["Batik Kawung"])
    daerah: str = Field(examples=["Yogyakarta"])
    aliran: str = ""
    ciri: str = ""
    sejarah: str = ""
    anatomi: str = ""
    filosofi: str = ""
    pakem: str = ""
    busana: str = ""
    deskripsi: str = ""
    draf: bool = Field(False, description="True kalau info motif masih draf dan perlu dicek")
    gambar: str | None = Field(None, description="Path gambar contoh, relatif ke base URL API", examples=["/images/kawung"])
    jumlah_gambar: int = 0
    tambahan: bool = Field(False, description="True kalau motif ditambahkan admin, bukan bawaan dataset")


class MotifMirip(BaseModel):
    motif: Motif
    skor: float = Field(examples=[0.81])
    label: str = Field(examples=["Cukup mirip"])


class SearchResponse(BaseModel):
    query_id: str
    model: str = Field(examples=["histogram"])
    tebakan: Motif | None = Field(None, description="Motif dengan skor tertinggi. null kalau galeri kosong")
    skor: float | None = Field(None, examples=[0.94])
    yakin: bool = Field(description="False berarti motif kemungkinan tidak ada di koleksi (skor < threshold)")
    threshold: float
    mirip: list[MotifMirip]


class PredictResponse(SearchResponse):
    """Sama dengan SearchResponse, ditambah field yang sudah dipakai frontend (pencarianLokal.js)."""
    class_id: str | None = Field(None, description="Sama dengan tebakan.id", examples=["kawung"])
    confidence: float | None = Field(None, description="Sama dengan skor", examples=[0.93])


class FeedbackIn(BaseModel):
    query_id: str
    cocok: bool


class OkResponse(BaseModel):
    ok: bool = True


class LoginIn(BaseModel):
    username: str
    password: str


class LoginOut(BaseModel):
    token: str
    username: str


class AdminStats(BaseModel):
    total_queries: int
    total_motifs: int
    feedback_positif: int
    feedback_negatif: int
    pencarian_tidak_dikenal: int


class MotifCreate(BaseModel):
    nama: str = Field(min_length=2, max_length=60)
    daerah: str = Field(min_length=2, max_length=80)
    deskripsi: str = Field("", max_length=2000)
    ciri: str = Field("", max_length=500)


class ModelInfo(BaseModel):
    id: str
    nama: str
    jenis: str
    jumlah_galeri: int
    threshold: float
    default: bool


class DatasetStats(BaseModel):
    total_motif: int
    total_gambar: int
    per_motif: dict[str, int] = Field(description="Jumlah gambar per id motif (TRAIN + TEST)")
    train: dict[str, int] = {}
    test: dict[str, int] = {}
    ringkasan: dict = Field({}, description="Angka lain dari dataset_stats.json (duplikat dikeluarkan, dsb.)")
    sumber: str


class Health(BaseModel):
    status: str
    models: list[str]
    default_model: str
    galeri: int = Field(description="Jumlah gambar di galeri model default")
    peringatan: list[str] = []
