from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from ..catalog import Catalog
from ..config import settings
from ..deps import get_catalog, get_engine, get_store, motif_out, read_image
from ..engine import SearchEngine
from ..models.schemas import FeedbackIn, OkResponse, PredictResponse, SearchResponse
from ..store import Store

router = APIRouter(tags=["Pencarian"])


def _label(skor: float) -> str:
    if skor >= settings.label_sangat_mirip:
        return "Sangat mirip"
    if skor >= settings.label_cukup_mirip:
        return "Cukup mirip"
    return "Sedikit mirip"


async def _run_search(file, top_k, daerah, model, engine: SearchEngine, store: Store, catalog: Catalog) -> dict:
    image, _ = await read_image(file)
    idx = engine.get(model or None)
    if idx is None:
        raise HTTPException(400, f"Model '{model}' tidak tersedia. Lihat GET /models.")
    top_k = min(top_k or settings.default_top_k, settings.max_top_k)

    motifs = {m["id"]: m for m in catalog.all()}
    allowed = set(motifs)
    if daerah:
        allowed = {mid for mid, m in motifs.items() if daerah.lower() in m["daerah"].lower()}

    # Inferensi model bisa lambat, jalankan di thread supaya server tetap responsif.
    vec = await run_in_threadpool(idx.embed, image)
    ranked = idx.rank_motifs(vec, allowed)

    query_id = uuid.uuid4().hex
    base = {"query_id": query_id, "model": idx.key, "threshold": idx.threshold}
    if not ranked:
        store.add_query(query_id, idx.key, None, None, False)
        return {**base, "tebakan": None, "skor": None, "yakin": False, "mirip": []}

    top_id, top_skor = ranked[0]
    yakin = top_skor >= idx.threshold
    store.add_query(query_id, idx.key, top_id, top_skor, yakin)
    return {
        **base,
        "tebakan": motif_out(motifs[top_id], engine),
        "skor": round(top_skor, 4),
        "yakin": yakin,
        "mirip": [
            {"motif": motif_out(motifs[mid], engine), "skor": round(s, 4), "label": _label(s)}
            for mid, s in ranked[1 : top_k + 1]
        ],
    }


@router.post("/search", response_model=SearchResponse, summary="Cari motif termirip dari foto")
async def search(
    file: UploadFile = File(..., description="Foto kain batik (JPG/PNG/WEBP)"),
    top_k: int = Form(None, ge=1, description="Jumlah motif mirip selain tebakan utama"),
    daerah: str = Form("", description="Opsional: batasi hasil ke daerah tertentu"),
    model: str = Form("", description="Opsional: id model dari GET /models"),
    engine: SearchEngine = Depends(get_engine),
    store: Store = Depends(get_store),
    catalog: Catalog = Depends(get_catalog),
):
    return await _run_search(file, top_k, daerah, model, engine, store, catalog)


@router.post(
    "/predict",
    response_model=PredictResponse,
    summary="Sama dengan /search, plus class_id & confidence (dipakai frontend saat ini)",
)
async def predict(
    file: UploadFile = File(..., description="Foto kain batik (JPG/PNG/WEBP)"),
    top_k: int = Form(None, ge=1),
    daerah: str = Form(""),
    model: str = Form(""),
    engine: SearchEngine = Depends(get_engine),
    store: Store = Depends(get_store),
    catalog: Catalog = Depends(get_catalog),
):
    r = await _run_search(file, top_k, daerah, model, engine, store, catalog)
    return {**r, "class_id": r["tebakan"]["id"] if r["tebakan"] else None, "confidence": r["skor"]}


@router.post("/feedback", response_model=OkResponse, summary="Simpan umpan balik cocok / tidak cocok")
def feedback(body: FeedbackIn, store: Store = Depends(get_store)):
    if not store.query_exists(body.query_id):
        raise HTTPException(404, "Pencarian tidak ditemukan.")
    store.set_feedback(body.query_id, body.cocok)
    return OkResponse()
