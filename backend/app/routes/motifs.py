from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse

from ..catalog import Catalog
from ..deps import get_catalog, get_engine, motif_out
from ..engine import SearchEngine
from ..models.schemas import Motif

router = APIRouter(tags=["Motif"])


@router.get("/motifs", response_model=list[Motif], summary="Daftar semua motif di koleksi")
def list_motifs(
    daerah: str = Query("", description="Opsional: filter berdasarkan daerah"),
    engine: SearchEngine = Depends(get_engine),
    catalog: Catalog = Depends(get_catalog),
):
    items = catalog.all()
    if daerah:
        items = [m for m in items if daerah.lower() in m["daerah"].lower()]
    return [motif_out(m, engine) for m in items]


@router.get("/motifs/{motif_id}", response_model=Motif, summary="Detail satu motif")
def get_motif(motif_id: str, engine: SearchEngine = Depends(get_engine), catalog: Catalog = Depends(get_catalog)):
    m = catalog.get(motif_id)
    if not m:
        raise HTTPException(404, "Motif tidak ditemukan.")
    return motif_out(m, engine)


@router.get(
    "/images/{motif_id}",
    response_class=FileResponse,
    summary="Gambar contoh motif dari galeri",
    responses={200: {"content": {"image/jpeg": {}}}},
)
def get_image(
    motif_id: str,
    i: int = Query(0, ge=0, description="Urutan gambar, kalau motif punya lebih dari satu"),
    engine: SearchEngine = Depends(get_engine),
):
    path = engine.image_path(motif_id, i)
    if not path or not path.exists():
        raise HTTPException(404, "Gambar tidak ditemukan.")
    return FileResponse(path, headers={"Cache-Control": "public, max-age=3600"})
