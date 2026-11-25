# Kontrak API BatikMatch

Versi 0.2 · Disusun Backend, mengikuti kode frontend terbaru (`src/api/client.js`, `src/api/pencarianLokal.js`),
dataset dari Data & Evaluasi (`outputs/reports/dataset_stats.json`), dan notebook Model Engineer (`notebooks/02–04`).

- **Base URL:** `http://localhost:8000` (frontend: `VITE_API_URL=http://localhost:8000`)
- **Dokumentasi interaktif:** `http://localhost:8000/docs`
- **CORS:** saat development, semua `http://localhost:<port>` dan `http://127.0.0.1:<port>` diizinkan.
- **Format error (semua endpoint):** status 4xx/5xx dengan body `{ "detail": "<pesan bahasa Indonesia>" }`.
- **Path gambar** (`gambar`) relatif ke base URL API. Di frontend: `${API_BASE}${motif.gambar}`.

---

## Daftar motif (15 kelas dataset)

ID motif mengikuti katalog frontend kalau motifnya sudah ada di sana. Kolom **Label dataset** adalah nama folder
di `data/raw/TRAIN/`. Backend otomatis menerjemahkan label ke ID.

| ID | Label dataset | Isi info motif |
|---|---|---|
| `bali` | Batik Bali | lengkap |
| `betawi` | Batik Betawi | lengkap |
| `celup` | Batik Ikat Celup | lengkap |
| `cendrawasih` | Batik Cendrawasih | lengkap |
| `dayak` | Batik Dayak | draf |
| `geblek-renteng` | Batik Geblek Renteng | draf |
| `insang` | Batik Insang | draf |
| `kawung` | Batik Kawung | lengkap |
| `lasem` | Batik Lasem | lengkap |
| `megamendung` | Batik Megamendung | lengkap |
| `pala` | Batik Pala | draf |
| `parang` | Batik Parang | lengkap |
| `poleng` | Batik Poleng | draf |
| `sekar-jagad` | Batik Sekar Jagad | lengkap |
| `tambal` | Batik Tambal | lengkap |

> ✅ `frontend/src/data/katalogMotif.js` sudah disamakan dengan 15 kelas ini. Lima motif yang sebelumnya
> belum ada (`dayak`, `geblek-renteng`, `insang`, `pala`, `poleng`) isinya masih draf (`draf: true`).

Info motif disimpan di `backend/app/data/motifs.json`. Isi 10 motif disalin dari `katalogMotif.js`.

## Objek `Motif`

```json
{
  "id": "kawung",
  "label": "Batik Kawung",
  "nama": "Batik Kawung",
  "daerah": "Yogyakarta",
  "aliran": "...", "ciri": "...", "sejarah": "...", "anatomi": "...",
  "filosofi": "...", "pakem": "...", "busana": "...",
  "deskripsi": "",
  "draf": false,
  "gambar": "/images/kawung",
  "jumlah_gambar": 70,
  "tambahan": false
}
```

Field teks sama dengan `katalogMotif.js`. Tambahan dari backend: `label`, `draf`, `gambar` (`null` kalau belum ada
gambar di galeri), `jumlah_gambar`, `tambahan` (`true` kalau ditambahkan admin).

---

## Pencarian

### `POST /predict` (dipakai frontend sekarang)

`multipart/form-data`: `file` (wajib, JPG/PNG/WEBP, maks 5 MB). Opsional: `top_k`, `daerah`, `model`.

```json
{
  "class_id": "kawung",
  "confidence": 0.93,
  "query_id": "e20c79e5b89f40649272564bf68f4781",
  "model": "efficientnet_b0_finetuned",
  "tebakan": { "id": "kawung", "...": "objek Motif" },
  "skor": 0.93,
  "yakin": true,
  "threshold": 0.7,
  "mirip": [
    { "motif": { "id": "parang", "...": "objek Motif" }, "skor": 0.81, "label": "Cukup mirip" }
  ]
}
```

| Field | Keterangan |
|---|---|
| `class_id`, `confidence` | Field yang sudah dibaca `pencarianLokal.js`. Sama dengan `tebakan.id` dan `skor` |
| `skor` | Cosine similarity motif teratas (0–1). Skor motif = kemiripan tertinggi di antara gambar galeri motif itu |
| `yakin` | `false` = **motif tidak dikenal** (skor < `threshold`). Pakai field ini, jangan hitung sendiri dari `confidence` |
| `tebakan` | `null` (dan `class_id: null`) kalau galeri kosong. Frontend jangan menampilkan motif apa pun |
| `mirip` | Motif lain selain tebakan, urut dari skor tertinggi. Default 3, maks 15 (`top_k`) |
| `mirip[].label` | `Sangat mirip` (≥ 0.85), `Cukup mirip` (≥ 0.70), `Sedikit mirip` |
| `query_id` | Untuk `POST /feedback` |

Error: `415` bukan gambar, `413` terlalu besar, `400` gambar rusak / model tidak ada.

### `POST /search`

Sama persis dengan `/predict`, tanpa `class_id` dan `confidence`.

### Cara frontend memakai `/predict`

Sudah diterapkan di `frontend/src/api/pencarianLokal.js` (versi ringkasnya):

```js
if (res.ok) {
  const data = await res.json();
  if (!data.tebakan) throw new Error("Galeri backend kosong");
  const lokal = (id) => KATALOG.find((m) => m.id === id) || {};
  const gabung = (m) => ({ ...m, ...lokal(m.id), gambar: m.gambar ? `${API_BASE}${m.gambar}` : lokal(m.id).gambar });
  return {
    query_id: data.query_id,
    tebakan: gabung(data.tebakan),
    skor: data.skor,
    yakin: data.yakin,
    mirip: data.mirip.map((x) => ({ motif: gabung(x.motif), label: `${Math.round(x.skor * 100)}% mirip` })),
  };
}
```

Timeout 2,5 detik di frontend cukup: backend memanaskan model saat start, dan inferensi EfficientNet-B0 di CPU
biasanya di bawah 0,5 detik.

### `POST /feedback`

```json
{ "query_id": "e20c79e5...", "cocok": true }
```
Respons `{ "ok": true }`. Kirim ulang untuk `query_id` yang sama akan menimpa jawaban sebelumnya. `404` kalau
`query_id` tidak dikenal. (Frontend sekarang menyimpan umpan balik di `localStorage` saja. Kalau dikirim ke sini,
hasilnya masuk `GET /admin/stats` dan bisa dipakai di laporan.)

---

## Motif dan gambar

| Endpoint | Respons |
|---|---|
| `GET /motifs?daerah=<opsional>` | `Motif[]` (15 motif + tambahan admin) |
| `GET /motifs/{id}` | `Motif`, atau `404` |
| `GET /images/{id}?i=0` | Gambar ke-`i` motif itu dari galeri (dataset TRAIN), atau `404` |

---

## Info sistem

### `GET /health`
```json
{ "status": "ok", "models": ["histogram", "efficientnet_b0_finetuned"], "default_model": "efficientnet_b0_finetuned",
  "galeri": 1050, "peringatan": [] }
```
`peringatan` berisi masalah saat start (galeri kosong, artefak tidak lengkap, torch belum terpasang).
`cekStatusBackend()` di frontend sudah memakai endpoint ini.

### `GET /models`
```json
[
  { "id": "histogram", "nama": "Histogram Warna (baseline)", "jenis": "baseline", "jumlah_galeri": 1031, "threshold": 0.7, "default": false },
  { "id": "efficientnet_b0_finetuned", "nama": "EfficientNet-B0 (fine-tuned)", "jenis": "finetuned", "jumlah_galeri": 1050, "threshold": 0.7, "default": true },
  { "id": "resnet50_pretrained", "nama": "ResNet50 (pretrained)", "jenis": "pretrained", "jumlah_galeri": 840, "threshold": 0.7, "default": false }
]
```
Kirim `id` sebagai field `model` di `/predict` atau `/search` (misalnya untuk halaman Perbandingan).

### `GET /dataset/stats`
Dari `outputs/reports/dataset_stats.json` (Data & Evaluasi), dengan label sudah diubah ke ID:
```json
{ "total_motif": 15, "total_gambar": 1326,
  "per_motif": { "bali": 90, "celup": 83, "...": 0 },
  "train": { "bali": 70, "...": 0 }, "test": { "bali": 20, "...": 0 },
  "ringkasan": { "total_train_bersih": 1031, "train_dikeluarkan": 19, "...": 0 },
  "sumber": "outputs/reports/dataset_stats.json" }
```

### `GET /evaluation`
Mengumpulkan file evaluasi yang sudah ada. Bagian yang file-nya belum ada tidak ditampilkan.
```json
{
  "tersedia": true,
  "models": [
    { "id": "histogram", "nama": "Histogram Warna (baseline)", "split": "test",
      "metrik": { "Precision@1": 0.2508, "Precision@5": 0.1736, "Precision@10": 0.1464, "Recall@5": 0.0126, "mAP": 0.0991 },
      "sumber": "outputs/baseline_color_histogram/ringkasan_metrik.csv" },
    { "id": "efficientnet_b0_finetuned", "nama": "efficientnet_b0 (fine-tuned)", "split": "test",
      "metrik": { "P@5": 0.81, "P@10": 0.77, "mAP": 0.7 }, "ci95": { "P@5": [0.77, 0.85] },
      "konfigurasi": { "tag": "D6_eff_u4_sgd_hi", "backbone": "efficientnet_b0", "...": "" },
      "sumber": "artifacts/results_test.csv" }
  ],
  "per_kelas": [ { "id": "celup", "kelas": "Batik Ikat Celup", "P@5": 0.9, "P@10": 0.85, "AP": 0.8, "top1_benar": 0.95, "n_query": 19 } ],
  "eksperimen": { "results_baseline": [ "...baris CSV..." ], "results_finetune": [ "...baris CSV..." ] }
}
```

> **Untuk Data & Evaluasi:** nama metrik baseline (`Precision@5`) dan model final (`P@5`) masih beda format.
> Sebaiknya disamakan di CSV supaya grafik di frontend tinggal membaca satu nama.

---

## Admin

Login dulu, lalu kirim `Authorization: Bearer <token>`. Token berlaku 12 jam. Tanpa token valid: `401`.

> **Untuk Frontend:** `AuthContext.jsx` sekarang membuat token tiruan (`mock-jwt-admin-...`) tanpa memanggil
> backend, jadi token itu **ditolak** endpoint admin. Kalau halaman admin mau memakai data asli, panggil
> `POST /admin/login` lalu simpan `token` dari respons ke `batikmatch_auth_v1`.

| Endpoint | Body | Respons |
|---|---|---|
| `POST /admin/login` | `{ "username", "password" }` | `{ "token", "username" }` |
| `GET /admin/stats` | | `{ "total_queries", "total_motifs", "feedback_positif", "feedback_negatif", "pencarian_tidak_dikenal" }` |
| `GET /admin/motifs` | | `Motif[]` |
| `POST /admin/motifs` | `{ "nama", "daerah", "deskripsi"?, "ciri"? }` | `201` + `Motif`. ID dibuat dari nama (`"Batik Uji"` → `batik-uji`). `409` kalau sudah ada |
| `POST /admin/motifs/{id}/images` | multipart `file` | `201` + `Motif`. Gambar langsung bisa dicari **tanpa melatih ulang** (fitur bonus 6) |
| `DELETE /admin/motifs/{id}` | | `{ "ok": true }`. Hanya motif tambahan; motif dataset → `403` |

---

## File yang dibaca backend

Tidak ada format baru yang perlu dibuat tim. Backend membaca file yang **sudah** dihasilkan notebook dan skrip kalian:

| File | Dari | Dipakai untuk |
|---|---|---|
| `data/raw/TRAIN/<label>/*.jpg` | Dataset Kaggle | Galeri histogram, `GET /images/{id}` |
| `artifacts/final_config.json` | notebook 03 | Arsitektur model final (`backbone`) |
| `artifacts/models/final.pt` | notebook 03 | Bobot model final (state_dict kelas `Net`) |
| `artifacts/embeddings/final_gallery.npy` + `final_gallery_manifest.csv` | notebook 03 | Galeri model final |
| `artifacts/embeddings/<arch>_gallery_pretrained.npy` + `gallery_paths.json` | notebook 02 | Model pretrained untuk perbandingan (opsional) |
| `artifacts/results_test.csv`, `results_test_per_class.csv` | notebook 04 | `GET /evaluation` |
| `artifacts/results_baseline.csv`, `results_finetune.csv` | notebook 02, 03 | `GET /evaluation` (tabel eksperimen) |
| `outputs/reports/dataset_stats.json` | Data & Evaluasi | `GET /dataset/stats` |
| `outputs/baseline_color_histogram/ringkasan_metrik.csv` | Data & Evaluasi | `GET /evaluation` |
| `artifacts/thresholds.json` (opsional) | Data & Evaluasi | Batas "motif tidak dikenal" per model, mis. `{"efficientnet_b0_finetuned": 0.62}` |

Path di manifest CSV dan `gallery_paths.json` relatif ke `data/raw` (sesuai `DATA_DIR` di notebook).
Karena `artifacts/` dan `data/` tidak di-commit, file-file itu perlu dibagikan lewat Drive dan diletakkan di
lokasi yang sama di laptop yang menjalankan backend.
