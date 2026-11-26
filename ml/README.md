# Modul `ml`: pemodelan dan inferensi Batikmatch

Foto kain batik diubah menjadi embedding 1.280 dimensi oleh EfficientNet-B0 yang sudah di-fine-tune pada 15 motif,
lalu dibandingkan dengan 1.031 gambar galeri memakai cosine similarity. Hasilnya adalah Top-K motif paling mirip.

Semua perintah dijalankan dari **root repo**.

## Isi folder

| File | Fungsi |
|---|---|
| `embedding.py` | transformasi gambar, dataset, `RetrievalNet`, `load_model`, ekstraksi embedding |
| `search.py` | cosine similarity, Top-K, hasil lengkap satu query |
| `evaluate.py` | Precision@K dan mAP |
| `train.py` | fine-tuning (logika notebook 03) dan `train_final` |
| `inference.py` | `BatikRetriever`, kelas yang dipakai backend |
| `verify.py` | mereproduksi metrik TEST notebook 04 dengan kode `ml` |

---

## Untuk backend

### 1. File yang harus ada

| File | Ukuran | Fungsi |
|---|---|---|
| `artifacts/models/final.pt` | 16,4 MB | bobot model final |
| `artifacts/embeddings/final_gallery.npy` | 5,3 MB | embedding 1.031 gambar galeri (float32, 1031 x 1280) |
| `artifacts/embeddings/final_gallery_manifest.csv` | 50 KB | path dan kelas tiap baris galeri (urutan sama dengan `.npy`) |
| `artifacts/final_config.json` | 174 B | konfigurasi model (backbone, dll.) |

Total sekitar 21,7 MB. Untuk **menampilkan gambar hasil**, backend juga butuh gambar galeri di `data/raw/TRAIN/`; folder itu ikut di Git.
Kolom `path` pada hasil pencarian relatif terhadap `data/raw/`, jadi gambarnya bisa disajikan langsung dari folder tersebut.

Selain keempat file itu, `artifacts/` di Git juga berisi tabel hasil (`results_baseline.csv`, `results_finetune.csv`, `results_test.csv`, `results_test_per_class.csv`) dan `history/` (kurva training). Bobot dan embedding eksperimen lain tidak di-commit.

### 2. Dependensi

Versi yang sudah teruji (Python 3.11, Windows, GPU CUDA 12.1):

```
torch==2.5.1
torchvision==0.20.1
numpy==2.4.6
pandas==3.0.6
pillow==12.0.0
```

Untuk server tanpa GPU, pasang PyTorch versi CPU:

```
pip install torch==2.5.1 torchvision==0.20.1 --index-url https://download.pytorch.org/whl/cpu
```

### 3. Cara memakai

Muat **sekali** saat server mulai, lalu panggil `search` di setiap request.

```python
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[2]))   # root repo, sesuaikan dengan lokasi file

from PIL import Image
from ml.inference import BatikRetriever

retriever = BatikRetriever()                          # sekali saat startup
retriever.search(Image.new("RGB", (224, 224)))        # pemanasan, lihat bagian latensi

hasil = retriever.search(bytes_upload, top_k=5)       # bytes dari upload, path file, atau PIL Image
```

`BatikRetriever(artifacts_dir=None, device=None, min_similarity=None)`:
`artifacts_dir` default `artifacts/` di root repo, `device` otomatis `cuda` atau `cpu`.

### 4. Bentuk keluaran `search()`

Contoh nyata (foto uji Batik Parang, `top_k=3`):

```json
{
  "predicted_class": "Batik Parang",
  "top1_similarity": 0.3932,
  "unknown": false,
  "results": [
    {"rank": 1, "class": "Batik Parang", "similarity": 0.3932, "path": "TRAIN/Batik Parang/47.jpg"},
    {"rank": 2, "class": "Batik Insang", "similarity": 0.3571, "path": "TRAIN/Batik Insang/37.jpg"},
    {"rank": 3, "class": "Batik Lasem",  "similarity": 0.3463, "path": "TRAIN/Batik Lasem/41.jpg"}
  ]
}
```

| Field | Arti |
|---|---|
| `predicted_class` | kelas gambar Top-1 (akurasi Top-1 di TEST 79,3%) |
| `top1_similarity` | cosine similarity gambar Top-1 |
| `unknown` | `true` kalau `top1_similarity < min_similarity`; selalu `false` bila `min_similarity=None` |
| `results[]` | Top-K gambar galeri: `rank`, `class`, `similarity`, `path` |

`retriever.info()` mengembalikan backbone, tag konfigurasi, jumlah galeri, jumlah kelas, dimensi embedding, dan device.

### 5. Latensi (diukur di GPU CUDA, satu foto)

| Tahap | Waktu |
|---|---|
| Muat model dan galeri | sekitar 1,1 detik |
| `search` pertama (pemanasan GPU) | sekitar 970 ms |
| `search` berikutnya | 17 sampai 20 ms |

Panggil satu `search` dengan gambar dummy saat startup agar request pertama pengguna tidak lambat.
Latensi di CPU belum diukur.

### 6. Hal yang perlu diperhatikan

- **Skor kemiripan belum dikalibrasi.** Pada contoh di atas, Top-1 yang benar hanya bernilai 0,39 dan selisihnya dengan peringkat 2 kecil.
  Jangan menampilkannya sebagai persentase ("39% cocok") dan jangan memasang ambang tetap seperti 0,5 tanpa mengukur distribusinya.
- **Fitur "motif tidak dikenal"** sudah punya tempat (`min_similarity`), tetapi nilai ambangnya belum ditentukan, sehingga `unknown` selalu `false`.
- **Koleksi tetap.** Model mengenal 15 motif dataset Kaggle. Menambah motif baru memerlukan embedding galeri baru (belum ada fungsinya).
- **Validasi unggahan** (tipe file, ukuran, file rusak) dilakukan di backend. `search()` melempar error PIL untuk gambar yang tidak terbaca.
- Orientasi EXIF foto HP dikoreksi otomatis. Gambar langsung di-resize ke 224x224 tanpa crop.

---

## Untuk tim pemodelan

```
python -m ml.verify               # bukti kode ml == notebook 04 (butuh data/raw, manifest.csv, dan artifacts final)
python -m ml.train --out artifacts_repro    # latih ulang model final (D6) ke folder terpisah, tidak menimpa artifacts/
```

Urutan notebook: `01_eda` (data) -> `02_ekstraksi_fitur` (manifest dan baseline) -> `03_finetuning` (eksperimen dan model final)
-> `04_evaluasi` (TEST). Ringkasan hasil ada di `docs/laporan/pemodelan.md`.

Reproduksi model final dari terminal (`python -m ml.train --out artifacts_repro`, lalu `python -m ml.verify --artifacts artifacts_repro`) menghasilkan embedding galeri dan metrik TEST yang identik dengan notebook 04 pada lingkungan yang sama.

Hasil `python -m ml.verify` terakhir: selisih embedding galeri 2,98e-08 dan metrik TEST identik dengan notebook 04
(P@5 0,7864, P@10 0,7797, mAP 0,7095).
