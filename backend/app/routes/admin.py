from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from ..auth import check_credentials, create_token, require_admin
from ..catalog import Catalog, slugify
from ..config import settings
from ..deps import get_catalog, get_engine, get_store, motif_out, read_image
from ..engine import SearchEngine
from ..models.schemas import AdminStats, LoginIn, LoginOut, Motif, MotifCreate, OkResponse
from ..store import Store

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/login", response_model=LoginOut, summary="Login admin, dapatkan token Bearer")
def login(body: LoginIn):
    if not check_credentials(body.username, body.password):
        raise HTTPException(401, "Username atau password salah.")
    return LoginOut(token=create_token(body.username), username=body.username)


@router.get("/stats", response_model=AdminStats, dependencies=[Depends(require_admin)])
def stats(store: Store = Depends(get_store), catalog: Catalog = Depends(get_catalog)):
    return {**store.stats(), "total_motifs": len(catalog.all())}


@router.get("/motifs", response_model=list[Motif], dependencies=[Depends(require_admin)])
def list_collection(engine: SearchEngine = Depends(get_engine), catalog: Catalog = Depends(get_catalog)):
    return [motif_out(m, engine) for m in catalog.all()]


@router.post("/motifs", response_model=Motif, status_code=201, dependencies=[Depends(require_admin)],
             summary="Tambah motif baru (info saja, gambar lewat endpoint images)")
def create_motif(
    body: MotifCreate,
    store: Store = Depends(get_store),
    engine: SearchEngine = Depends(get_engine),
    catalog: Catalog = Depends(get_catalog),
):
    motif_id = slugify(body.nama)
    if not motif_id:
        raise HTTPException(422, "Nama motif harus mengandung huruf atau angka.")
    if motif_id in catalog.ids():
        raise HTTPException(409, f"Motif '{body.nama}' sudah ada di koleksi.")
    m = {"id": motif_id, **body.model_dump(), "nama": body.nama.strip(), "daerah": body.daerah.strip()}
    store.add_custom_motif(m)
    return motif_out({**m, "tambahan": True}, engine)


@router.post("/motifs/{motif_id}/images", response_model=Motif, status_code=201,
             dependencies=[Depends(require_admin)],
             summary="Tambah gambar ke galeri motif tanpa melatih ulang (fitur bonus)")
async def add_motif_image(
    motif_id: str,
    file: UploadFile = File(...),
    store: Store = Depends(get_store),
    engine: SearchEngine = Depends(get_engine),
    catalog: Catalog = Depends(get_catalog),
):
    m = catalog.get(motif_id)
    if not m:
        raise HTTPException(404, "Motif tidak ditemukan.")
    image, _ = await read_image(file)
    rel = f"{motif_id}/{uuid.uuid4().hex}.jpg"
    path = settings.upload_dir / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "JPEG", quality=92)
    try:
        await run_in_threadpool(engine.add_image, motif_id, path, image)
    except Exception:
        path.unlink(missing_ok=True)
        raise
    store.add_upload(motif_id, rel)
    return motif_out(m, engine)


@router.delete("/motifs/{motif_id}", response_model=OkResponse, dependencies=[Depends(require_admin)],
               summary="Hapus motif tambahan (motif bawaan dataset tidak bisa dihapus)")
def delete_motif(
    motif_id: str,
    store: Store = Depends(get_store),
    engine: SearchEngine = Depends(get_engine),
    catalog: Catalog = Depends(get_catalog),
):
    if catalog.is_builtin(motif_id):
        raise HTTPException(403, "Motif bawaan dataset tidak bisa dihapus.")
    if not catalog.get(motif_id):
        raise HTTPException(404, "Motif tidak ditemukan.")
    for rel in store.delete_custom_motif(motif_id):
        (settings.upload_dir / rel).unlink(missing_ok=True)
    engine.remove_motif(motif_id)
    return OkResponse()
