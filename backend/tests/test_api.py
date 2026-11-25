"""Tes API. Jalankan dari folder backend: python -m pytest -q

Tes memakai galeri tiruan dengan struktur yang sama seperti dataset asli
(data/raw/TRAIN/Batik Kawung/..., dst.), jadi tidak butuh dataset atau torch.
"""
from __future__ import annotations

import csv
import io
import json

import numpy as np
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.config import settings

# 4 kelas dengan warna dominan berbeda, 3 gambar per kelas
CLASSES = {
    "Batik Kawung": (200, 40, 40),
    "Batik Ikat Celup": (40, 200, 40),
    "Batik Megamendung": (40, 40, 200),
    "Batik Poleng": (230, 230, 230),
}


def make_image(color, seed=0, size=(64, 64)) -> Image.Image:
    rng = np.random.default_rng(seed)
    arr = np.clip(np.array(color) + rng.integers(-15, 16, (*size, 3)), 0, 255).astype(np.uint8)
    return Image.fromarray(arr)


def to_bytes(img: Image.Image, fmt="PNG") -> bytes:
    buf = io.BytesIO()
    img.save(buf, fmt)
    return buf.getvalue()


@pytest.fixture()
def dataset(tmp_path):
    root = tmp_path / "data" / "raw"
    for cls, color in CLASSES.items():
        d = root / "TRAIN" / cls
        d.mkdir(parents=True)
        for i in range(3):
            make_image(color, seed=i).save(d / f"{i}.jpg")
    return root


def configure(monkeypatch, tmp_path, dataset):
    monkeypatch.setattr(settings, "database_path", tmp_path / "test.db")
    monkeypatch.setattr(settings, "upload_dir", tmp_path / "uploads")
    monkeypatch.setattr(settings, "artifacts_dir", tmp_path / "artifacts")
    monkeypatch.setattr(settings, "outputs_dir", tmp_path / "outputs")
    monkeypatch.setattr(settings, "data_dir", dataset)
    monkeypatch.setattr(settings, "gallery_dir", dataset / "TRAIN")
    monkeypatch.setattr(settings, "default_model", "")
    monkeypatch.setattr(settings, "threshold_yakin", 0.70)


@pytest.fixture()
def client(tmp_path, monkeypatch, dataset):
    configure(monkeypatch, tmp_path, dataset)
    from app.main import app

    with TestClient(app) as c:
        yield c


def login(client) -> dict:
    r = client.post("/admin/login", json={"username": "admin", "password": "admin"})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['token']}"}


def upload(color, seed=99, fmt="PNG", ctype="image/png"):
    return {"file": ("q.png", to_bytes(make_image(color, seed), fmt), ctype)}


# --- info -------------------------------------------------------------------
def test_health_and_models(client):
    r = client.get("/health").json()
    assert r["status"] == "ok" and r["default_model"] == "histogram" and r["galeri"] == 12
    assert r["peringatan"] == []
    models = client.get("/models").json()
    assert models[0]["id"] == "histogram" and models[0]["jumlah_galeri"] == 12


def test_health_warns_when_gallery_empty(tmp_path, monkeypatch, dataset):
    configure(monkeypatch, tmp_path, dataset)
    monkeypatch.setattr(settings, "gallery_dir", tmp_path / "tidak-ada")
    from app.main import app

    with TestClient(app) as c:
        h = c.get("/health").json()
        assert h["galeri"] == 0 and any("Galeri kosong" in w for w in h["peringatan"])
        d = c.post("/predict", files=upload(CLASSES["Batik Kawung"])).json()
        assert d["tebakan"] is None and d["class_id"] is None and d["yakin"] is False


def test_dataset_stats_from_gallery(client):
    r = client.get("/dataset/stats").json()
    assert r["sumber"] == "galeri" and r["total_gambar"] == 12
    assert r["per_motif"] == {"kawung": 3, "celup": 3, "megamendung": 3, "poleng": 3}


def test_dataset_stats_from_data_report(client):
    f = settings.outputs_dir / "reports" / "dataset_stats.json"
    f.parent.mkdir(parents=True)
    f.write_text(json.dumps({"jumlah_kelas": 2, "train_dikeluarkan": 1, "distribusi": {
        "TRAIN": {"Batik Kawung": 70, "Batik Ikat Celup": 64},
        "TEST": {"Batik Kawung": 20, "Batik Ikat Celup": 19}}}))
    r = client.get("/dataset/stats").json()
    assert r["per_motif"] == {"celup": 83, "kawung": 90} and r["total_gambar"] == 173
    assert r["train"]["celup"] == 64 and r["ringkasan"]["train_dikeluarkan"] == 1


def test_evaluation(client):
    assert client.get("/evaluation").json()["tersedia"] is False

    hist = settings.outputs_dir / "baseline_color_histogram" / "ringkasan_metrik.csv"
    hist.parent.mkdir(parents=True)
    hist.write_text(",nilai\nPrecision@5,0.17355\nmAP,0.0991\n")
    art = settings.artifacts_dir
    art.mkdir(parents=True)
    (art / "results_test.csv").write_text("metrik,nilai,CI95_bawah,CI95_atas\nP@5,0.81,0.77,0.85\nmAP,0.7,0.66,0.74\n")
    (art / "final_config.json").write_text(json.dumps({"tag": "D6", "backbone": "efficientnet_b0"}))
    (art / "results_test_per_class.csv").write_text("kelas,P@5,AP\nBatik Ikat Celup,0.9,0.8\n")

    r = client.get("/evaluation").json()
    assert r["tersedia"] is True
    ids = [m["id"] for m in r["models"]]
    assert ids == ["histogram", "efficientnet_b0_finetuned"]
    assert r["models"][0]["metrik"]["mAP"] == 0.0991
    assert r["models"][1]["ci95"]["P@5"] == [0.77, 0.85]
    assert r["per_kelas"][0]["id"] == "celup"


# --- motif --------------------------------------------------------------------
def test_motifs_list_detail_and_image(client):
    items = client.get("/motifs").json()
    assert len(items) == 15
    ids = {m["id"] for m in items}
    assert {"bali", "celup", "geblek-renteng", "sekar-jagad", "poleng"} <= ids
    kawung = next(m for m in items if m["id"] == "kawung")
    assert kawung["label"] == "Batik Kawung" and kawung["gambar"] == "/images/kawung" and kawung["jumlah_gambar"] == 3
    assert next(m for m in items if m["id"] == "bali")["gambar"] is None  # tidak ada di galeri tes
    assert client.get("/motifs", params={"daerah": "cirebon"}).json()[0]["id"] == "megamendung"
    assert client.get("/motifs/tidakada").status_code == 404
    img = client.get("/images/celup")
    assert img.status_code == 200 and img.headers["content-type"].startswith("image/")
    assert client.get("/images/celup", params={"i": 5}).status_code == 404


# --- pencarian ----------------------------------------------------------------
def test_search_finds_right_class(client):
    d = client.post("/search", files=upload(CLASSES["Batik Megamendung"]), data={"top_k": "2"}).json()
    assert d["tebakan"]["id"] == "megamendung" and d["yakin"] is True
    assert len(d["mirip"]) == 2 and all(m["motif"]["id"] != "megamendung" for m in d["mirip"])
    skor = [m["skor"] for m in d["mirip"]]
    assert skor == sorted(skor, reverse=True) and skor[0] <= d["skor"]
    assert {m["label"] for m in d["mirip"]} <= {"Sangat mirip", "Cukup mirip", "Sedikit mirip"}


def test_predict_matches_frontend_shape(client):
    """Frontend (pencarianLokal.js) membaca data.class_id dan data.confidence dari POST /predict."""
    d = client.post("/predict", files=upload(CLASSES["Batik Ikat Celup"], fmt="JPEG", ctype="image/jpeg")).json()
    assert d["class_id"] == "celup" and d["tebakan"]["id"] == "celup"
    assert d["confidence"] == d["skor"] and 0 < d["confidence"] <= 1
    assert d["query_id"] and isinstance(d["mirip"], list)


def test_search_daerah_filter(client):
    d = client.post("/search", files=upload(CLASSES["Batik Kawung"]), data={"daerah": "Bali"}).json()
    assert d["tebakan"]["id"] == "poleng" and d["mirip"] == []


def test_search_unknown_motif(client):
    client.app.state.engine.models["histogram"].threshold = 0.999
    d = client.post("/search", files=upload((128, 0, 255))).json()
    assert d["yakin"] is False and d["tebakan"] is not None


@pytest.mark.parametrize(
    "name,content,ctype,code",
    [("a.txt", b"halo", "text/plain", 415), ("a.png", b"bukan gambar", "image/png", 400), ("a.png", b"", "image/png", 400)],
)
def test_search_rejects_bad_upload(client, name, content, ctype, code):
    r = client.post("/predict", files={"file": (name, content, ctype)})
    assert r.status_code == code and "detail" in r.json()


def test_search_rejects_large_upload(client, monkeypatch):
    monkeypatch.setattr(settings, "max_upload_mb", 0.001)
    big = to_bytes(Image.fromarray(np.random.default_rng(0).integers(0, 256, (300, 300, 3), dtype=np.uint8)))
    assert client.post("/search", files={"file": ("a.png", big, "image/png")}).status_code == 413


def test_search_unknown_model(client):
    r = client.post("/search", files=upload((0, 0, 0)), data={"model": "resnet99"})
    assert r.status_code == 400


def test_cors_allows_vite_any_port(client):
    for origin in ("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"):
        r = client.options("/predict", headers={"Origin": origin, "Access-Control-Request-Method": "POST",
                                                "Access-Control-Request-Headers": "authorization"})
        assert r.headers.get("access-control-allow-origin") == origin
    r = client.options("/predict", headers={"Origin": "http://evil.example", "Access-Control-Request-Method": "POST"})
    assert "access-control-allow-origin" not in r.headers


# --- umpan balik --------------------------------------------------------------
def test_feedback_flow_and_stats(client):
    qid = client.post("/search", files=upload((0, 0, 0))).json()["query_id"]
    assert client.post("/feedback", json={"query_id": qid, "cocok": True}).json() == {"ok": True}
    assert client.post("/feedback", json={"query_id": "ngawur", "cocok": True}).status_code == 404
    s = client.get("/admin/stats", headers=login(client)).json()
    assert s["total_queries"] == 1 and s["feedback_positif"] == 1 and s["total_motifs"] == 15


# --- admin --------------------------------------------------------------------
def test_admin_requires_token(client):
    assert client.post("/admin/login", json={"username": "admin", "password": "salah"}).status_code == 401
    assert client.get("/admin/stats").status_code == 401
    assert client.get("/admin/stats", headers={"Authorization": "Bearer palsu.123"}).status_code == 401
    # token tiruan dari AuthContext frontend tidak diterima
    assert client.get("/admin/stats", headers={"Authorization": "Bearer mock-jwt-admin-1"}).status_code == 401


def test_admin_add_motif_image_then_search_then_delete(client):
    h = login(client)
    r = client.post("/admin/motifs", headers=h, json={"nama": "Batik Uji Coba", "daerah": "Bandung", "deskripsi": "tes"})
    assert r.status_code == 201 and r.json()["id"] == "batik-uji-coba" and r.json()["gambar"] is None
    assert client.post("/admin/motifs", headers=h, json={"nama": "Batik Uji Coba", "daerah": "Garut"}).status_code == 409
    assert len(client.get("/admin/motifs", headers=h).json()) == 16

    color = (250, 0, 250)
    r = client.post("/admin/motifs/batik-uji-coba/images", headers=h, files=upload(color, seed=1))
    assert r.status_code == 201 and r.json()["jumlah_gambar"] == 1

    # motif baru langsung bisa ditemukan tanpa melatih ulang
    assert client.post("/predict", files=upload(color, seed=2)).json()["class_id"] == "batik-uji-coba"

    assert client.delete("/admin/motifs/kawung", headers=h).status_code == 403
    assert client.delete("/admin/motifs/batik-uji-coba", headers=h).json() == {"ok": True}
    assert client.get("/motifs/batik-uji-coba").status_code == 404
    assert client.post("/predict", files=upload(color, seed=2)).json()["class_id"] != "batik-uji-coba"


# --- model fine-tuned dari notebook 03 --------------------------------------------
def test_finetuned_artifacts_loaded(tmp_path, monkeypatch, dataset):
    """Simulasi file dari notebooks/03_finetuning.ipynb. Pemuat bobot torch diganti tiruan
    supaya tes tidak butuh torch; yang dites adalah pembacaan config, embedding, dan manifest."""
    configure(monkeypatch, tmp_path, dataset)

    def fake_extract(image):
        return np.asarray(image.convert("RGB").resize((1, 1))).astype(np.float32).ravel()

    import app.cnn as cnn

    monkeypatch.setattr(cnn, "load_finetuned", lambda arch, path, img_size=224: fake_extract)

    art = settings.artifacts_dir
    (art / "models").mkdir(parents=True)
    (art / "embeddings").mkdir()
    (art / "models" / "final.pt").write_bytes(b"bobot")
    (art / "final_config.json").write_text(json.dumps({"tag": "D6_eff_u4_sgd_hi", "backbone": "efficientnet_b0"}))
    (art / "thresholds.json").write_text(json.dumps({"efficientnet_b0_finetuned": 0.5}))

    rows, embs = [], []
    for cls in CLASSES:
        for i in range(3):
            rel = f"TRAIN/{cls}/{i}.jpg"
            rows.append({"path": rel, "class": cls, "split": "train"})
            embs.append(fake_extract(Image.open(dataset / rel)))
    np.save(art / "embeddings" / "final_gallery.npy", np.stack(embs))
    with (art / "embeddings" / "final_gallery_manifest.csv").open("w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=["path", "class", "split"])
        w.writeheader()
        w.writerows(rows)

    from app.main import app

    with TestClient(app) as c:
        h = c.get("/health").json()
        assert h["default_model"] == "efficientnet_b0_finetuned" and h["peringatan"] == []
        models = {m["id"]: m for m in c.get("/models").json()}
        assert models["efficientnet_b0_finetuned"]["nama"] == "EfficientNet-B0 (fine-tuned)"
        assert models["efficientnet_b0_finetuned"]["threshold"] == 0.5
        assert models["efficientnet_b0_finetuned"]["jumlah_galeri"] == 12

        d = c.post("/predict", files=upload(CLASSES["Batik Poleng"])).json()
        assert d["model"] == "efficientnet_b0_finetuned" and d["class_id"] == "poleng"
        d = c.post("/predict", files=upload(CLASSES["Batik Poleng"]), data={"model": "histogram"}).json()
        assert d["model"] == "histogram" and d["class_id"] == "poleng"


def test_incomplete_artifacts_give_warning(tmp_path, monkeypatch, dataset):
    configure(monkeypatch, tmp_path, dataset)
    (settings.artifacts_dir / "models").mkdir(parents=True)
    (settings.artifacts_dir / "models" / "final.pt").write_bytes(b"x")
    from app.main import app

    with TestClient(app) as c:
        h = c.get("/health").json()
        assert h["default_model"] == "histogram"
        assert any("tidak lengkap" in w for w in h["peringatan"])
