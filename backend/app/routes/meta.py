from __future__ import annotations

import csv
import json
from pathlib import Path

from fastapi import APIRouter, Depends

from ..catalog import Catalog
from ..config import settings
from ..deps import get_catalog, get_engine
from ..engine import SearchEngine
from ..models.schemas import DatasetStats, Health, ModelInfo

router = APIRouter(tags=["Info"])


@router.get("/health", response_model=Health)
def health(engine: SearchEngine = Depends(get_engine)):
    idx = engine.get(None)
    return Health(status="ok", models=list(engine.models), default_model=engine.default_model,
                  galeri=len(idx.motif_ids) if idx else 0, peringatan=engine.warnings)


@router.get("/models", response_model=list[ModelInfo], summary="Model yang bisa dipilih di POST /search")
def models(engine: SearchEngine = Depends(get_engine)):
    return [
        ModelInfo(id=k, nama=m.nama, jenis=m.jenis, jumlah_galeri=len(m.motif_ids),
                  threshold=m.threshold, default=(k == engine.default_model))
        for k, m in engine.models.items()
    ]


@router.get("/dataset/stats", response_model=DatasetStats, summary="Jumlah gambar per motif")
def dataset_stats(engine: SearchEngine = Depends(get_engine), catalog: Catalog = Depends(get_catalog)):
    """Membaca outputs/reports/dataset_stats.json dari Data & Evaluasi.
    Kalau belum ada, dihitung dari galeri yang sedang dimuat."""
    f = settings.outputs_dir / "reports" / "dataset_stats.json"
    if f.exists():
        d = json.loads(f.read_text(encoding="utf-8"))
        dist = d.get("distribusi", {})
        train = {catalog.resolve(k): v for k, v in dist.get("TRAIN", {}).items()}
        test = {catalog.resolve(k): v for k, v in dist.get("TEST", {}).items()}
        per = {k: train.get(k, 0) + test.get(k, 0) for k in sorted(set(train) | set(test))}
        return DatasetStats(
            total_motif=len(per), total_gambar=sum(per.values()), per_motif=per, train=train, test=test,
            ringkasan={k: v for k, v in d.items() if k != "distribusi"}, sumber="outputs/reports/dataset_stats.json",
        )
    per = engine.counts()
    return DatasetStats(total_motif=len(per), total_gambar=sum(per.values()), per_motif=per, sumber="galeri")


def _read_csv(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def _num(v):
    try:
        return round(float(v), 4)
    except (TypeError, ValueError):
        return v


@router.get("/evaluation", summary="Hasil evaluasi (Precision@K, Recall@K, mAP)")
def evaluation(catalog: Catalog = Depends(get_catalog)):
    """Mengumpulkan hasil evaluasi dari file yang dibuat tim:
    - outputs/baseline_color_histogram/ringkasan_metrik.csv  (Data & Evaluasi, baseline histogram)
    - artifacts/results_test.csv                             (notebook 04, model final di TEST)
    - artifacts/results_test_per_class.csv                   (notebook 04, per kelas)
    - artifacts/results_baseline.csv, results_finetune.csv   (notebook 02/03, tabel eksperimen)
    Bagian yang file-nya belum ada tidak ditampilkan.
    """
    out: dict = {"tersedia": False, "models": [], "per_kelas": [], "eksperimen": {}}

    hist = settings.outputs_dir / "baseline_color_histogram" / "ringkasan_metrik.csv"
    if hist.exists():
        rows = _read_csv(hist)
        key_col = next(iter(rows[0].keys())) if rows else ""
        metrik = {r[key_col]: _num(r.get("nilai")) for r in rows}
        out["models"].append({"id": "histogram", "nama": "Histogram Warna (baseline)", "split": "test",
                              "metrik": metrik, "sumber": str(hist.relative_to(settings.outputs_dir.parent))})

    final = settings.artifacts_dir / "results_test.csv"
    if final.exists():
        rows = _read_csv(final)
        cfg_f = settings.artifacts_dir / "final_config.json"
        cfg = json.loads(cfg_f.read_text(encoding="utf-8")) if cfg_f.exists() else {}
        out["models"].append({
            "id": f"{cfg.get('backbone', 'cnn')}_finetuned",
            "nama": f"{cfg.get('backbone', 'CNN')} (fine-tuned)",
            "split": "test",
            "metrik": {r["metrik"]: _num(r["nilai"]) for r in rows},
            "ci95": {r["metrik"]: [_num(r.get("CI95_bawah")), _num(r.get("CI95_atas"))] for r in rows},
            "konfigurasi": cfg,
            "sumber": "artifacts/results_test.csv",
        })

    per_class = settings.artifacts_dir / "results_test_per_class.csv"
    if per_class.exists():
        out["per_kelas"] = [
            {"id": catalog.resolve(r.get("kelas", "")), **{k: _num(v) for k, v in r.items()}}
            for r in _read_csv(per_class)
        ]

    for name in ("results_baseline", "results_finetune"):
        f = settings.artifacts_dir / f"{name}.csv"
        if f.exists():
            out["eksperimen"][name] = [{k: _num(v) for k, v in r.items()} for r in _read_csv(f)]

    out["tersedia"] = bool(out["models"])
    return out
