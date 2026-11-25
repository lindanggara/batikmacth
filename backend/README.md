# BatikMatch Backend (FastAPI)

## Menjalankan (Windows PowerShell)

Dari folder `backend`:

```powershell
# sekali saja
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m pip install -r requirements-ml.txt   # untuk model CNN (torch, ukurannya besar)
copy .env.example .env

# setiap kali menjalankan server
.venv\Scripts\python -m uvicorn app.main:app --reload
```

macOS/Linux: ganti `.venv\Scripts\python` dengan `.venv/bin/python` dan `copy` dengan `cp`.

- API: http://localhost:8000
- Dokumentasi + coba endpoint: http://localhost:8000/docs
- Kontrak lengkap: [`docs/api-contract.md`](../docs/api-contract.md)

Frontend (`frontend/.env`) cukup berisi `VITE_API_URL=http://localhost:8000`.

## Data yang dibutuhkan

Dataset dan model tidak ada di GitHub (terlalu besar). Minta ke teman, lalu letakkan di root repo:

```
batikmacth/
  data/raw/TRAIN/Batik Bali/*.jpg ...        ← dataset (dari Data & Evaluasi / Kaggle)
  data/raw/TEST/...
  artifacts/final_config.json                ← dari Model Engineer (notebook 03)
  artifacts/models/final.pt
  artifacts/embeddings/final_gallery.npy
  artifacts/embeddings/final_gallery_manifest.csv
  artifacts/results_test.csv                 ← notebook 04 (opsional, untuk /evaluation)
```

`outputs/` (statistik dataset dan metrik baseline) sudah ada di repo.

Cek hasilnya di http://localhost:8000/health:
- `galeri` harus lebih dari 0. Kalau 0, dataset belum di tempat yang benar.
- `default_model` jadi `efficientnet_b0_finetuned` kalau file model sudah lengkap dan torch terpasang.
- `peringatan` menjelaskan apa yang kurang.

**Tanpa file model**, backend tetap jalan dengan model **histogram warna** (baseline). Semua endpoint berfungsi,
hanya akurasinya rendah. Begitu file model diletakkan, restart server dan model CNN otomatis jadi default.

## Struktur

```
app/
  main.py           # buat app, CORS, lifespan (memuat model SEKALI saat start)
  config.py         # baca .env
  engine.py         # embedding + cosine similarity, memuat histogram / fine-tuned / pretrained
  cnn.py            # arsitektur Net (sama dengan notebook 03) dan pemuat bobot torch
  catalog.py        # info motif + peta label dataset -> id ("Batik Ikat Celup" -> "celup")
  store.py          # SQLite: riwayat pencarian, umpan balik, motif & gambar tambahan
  auth.py           # login admin + token
  deps.py           # validasi upload, helper
  data/motifs.json  # info 15 motif (10 dari katalog frontend, 5 masih draf)
  models/schemas.py # bentuk request/response
  routes/           # search (+ predict), motifs, admin, meta
tests/test_api.py
```

## Tes

```powershell
.venv\Scripts\python -m pip install -r requirements-dev.txt
.venv\Scripts\python -m pytest -q
```

## Demo lewat internet (ngrok)

```powershell
# terminal 1: backend
.venv\Scripts\python -m uvicorn app.main:app --port 8000
# terminal 2: ekspos backend
ngrok http 8000
```

Isi `VITE_API_URL` di frontend dengan URL https dari ngrok, lalu jalankan dan ekspos frontend dengan cara yang sama
(`ngrok http 5173` di terminal lain). Tambahkan URL frontend ngrok ke `CORS_ORIGINS` di `backend/.env`.
**Sebelum demo publik, ganti `ADMIN_PASSWORD` dan `SECRET_KEY` di `.env`.**
