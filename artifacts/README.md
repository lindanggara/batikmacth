# Artefak Model

Hasil pemodelan Batikmatch: model final, embedding galeri, dan tabel hasil eksperimen.
Penjelasan cara memakai model di backend ada di [`ml/README.md`](../ml/README.md), ringkasan hasilnya di
[`docs/laporan/pemodelan.md`](../docs/laporan/pemodelan.md).

> Nama file lama di README sebelumnya (`model.pt`, `embedding_index.npy`, `labels.json`) **sudah tidak dipakai**.
> Gantinya ada di tabel berikut.

## File yang ada di Git

### Untuk backend (`ml.inference.BatikRetriever` memuat keempatnya)

| File | Ukuran | Isi |
|---|---|---|
| `models/final.pt` | 16,4 MB | bobot model final: EfficientNet-B0 hasil fine-tuning (konfigurasi D6) |
| `embeddings/final_gallery.npy` | 5,3 MB | embedding 1.031 gambar galeri, float32, bentuk 1031 x 1280, L2-normal |
| `embeddings/final_gallery_manifest.csv` | 50 KB | `path`, `class`, `split` tiap baris galeri, **urutannya sama dengan `final_gallery.npy`** |
| `final_config.json` | 174 B | konfigurasi model (backbone, blok yang dibuka, optimizer, epoch) |

Daftar kelas (15) tidak disimpan di `labels.json`; ia diambil dari kolom `class` pada `final_gallery_manifest.csv`
dan diurutkan abjad. Urutan itu juga indeks kelas saat training:
Bali, Betawi, Cendrawasih, Dayak, Geblek Renteng, Ikat Celup, Insang, Kawung, Lasem, Megamendung, Pala, Parang, Poleng, Sekar Jagad, Tambal (semuanya berawalan "Batik").

### Tabel hasil (untuk laporan dan tim evaluasi)

| File | Isi | Dibuat oleh |
|---|---|---|
| `results_baseline.csv` | baseline embedding pretrained (ResNet50, MobileNetV2, EfficientNet-B0) pada validation | notebook 02 |
| `results_finetune.csv` | konfigurasi dan metrik tiap eksperimen fine-tuning pada validation | notebook 03 |
| `history/*.json` | kurva loss dan metrik validation per epoch tiap eksperimen (epoch 0 = baseline) | notebook 03 |
| `results_test.csv` | metrik TEST model final (P@5, P@10, mAP, Top-1) beserta CI 95% | notebook 04 |
| `results_test_per_class.csv` | metrik TEST per kelas | notebook 04 |
| `embeddings/gallery_paths.json` | urutan 824 gambar galeri validation, untuk memastikan split sama di semua notebook | notebook 02 |

Hasil utama (TEST, galeri 1.031, 295 query): **P@5 0,7864, P@10 0,7797, mAP 0,7095**.

## File yang tidak ada di Git

Dibuat ulang oleh notebook di komputer masing-masing, atau terlalu besar:

- `data_version.json`: dibuat notebook 02 (hash `data/manifest.csv`, dipakai notebook 03 dan 04 untuk memastikan data yang sama).
- `embeddings/*_pretrained.npy`: embedding baseline (notebook 02).
- `models/<tag>.pt` dan `embeddings/<tag>_gallery.npy`, `<tag>_val.npy`: bobot dan embedding tiap eksperimen (notebook 03).
- `pre_clean/` dan `artifacts_repro/`: arsip hasil sebelum pembersihan data dan folder uji reproduksi.

## Cara memakai dan membuat ulang

**Backend** (tidak perlu membuat ulang apa pun, cukup `git pull`):

```python
from ml.inference import BatikRetriever
retriever = BatikRetriever()    # membaca artifacts/ otomatis
```

**Memeriksa artefak** (butuh `data/raw/` dan `data/manifest.csv`):

```
python -m ml.verify
```

**Membuat ulang dari awal** (urutan notebook, atau dari terminal):

1. `notebooks/02_ekstraksi_fitur.ipynb`: membuat `data/manifest.csv`, `data_version.json`, dan baseline.
2. `notebooks/03_finetuning.ipynb`: eksperimen, lalu model final (`RUN_FINAL = True`).
3. `notebooks/04_evaluasi.ipynb`: evaluasi TEST.

```
python -m ml.train --out artifacts_repro      # melatih model final ke folder terpisah
python -m ml.verify --artifacts artifacts_repro
```

Pada komputer dan GPU yang sama, hasil reproduksi ini identik dengan notebook (selisih metrik TEST 0,0000).

## Perhatian

- Keempat file untuk backend adalah satu paket. Kalau model dilatih ulang, **ganti keempatnya sekaligus**:
  `final_gallery.npy` dan `final_gallery_manifest.csv` harus selalu berpasangan, dan `final.pt` harus berasal dari konfigurasi di `final_config.json`.
- Setelah mengganti artefak, jalankan `python -m ml.verify` dan perbarui `results_test.csv`.
- Jangan menimpa `artifacts/` yang ada hanya untuk uji coba; pakai folder lain (`--out artifacts_repro`).