"""BatikMatch API.

Jalankan dari folder backend:
    uvicorn app.main:app --reload
Dokumentasi otomatis: http://localhost:8000/docs
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .catalog import Catalog
from .config import settings
from .engine import SearchEngine
from .routes import admin, meta, motifs, search
from .store import Store

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Semua yang berat dimuat SEKALI di sini, bukan di tiap request.
    store = Store(settings.database_path)
    catalog = Catalog(store)
    engine = SearchEngine()
    engine.load(store.list_uploads(), catalog.resolve)
    app.state.store = store
    app.state.engine = engine
    app.state.catalog = catalog
    yield
    store.close()


app = FastAPI(
    title="BatikMatch API",
    description="Pencocokan dan pencarian motif batik berbasis citra digital.",
    version="0.1.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?" if settings.cors_allow_localhost else None,
    allow_methods=["*"],
    allow_headers=["*"],
)

for r in (meta.router, search.router, motifs.router, admin.router):
    app.include_router(r)
