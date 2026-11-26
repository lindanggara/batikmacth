# Data

Dataset gambar **ikut di Git** supaya seluruh tim bisa langsung memakainya setelah `git pull`.

## Sumber

Kaggle: *Indonesian Batik Motifs (Corak App)*, https://www.kaggle.com/datasets/alfanme/indonesian-batik-motifs-corak-app
(15 kelas motif batik, gambar 224 x 224).

## Struktur

```
data/
├── README.md
├── manifest.csv          # daftar gambar bersih: path, class, split
└── raw/
    ├── TRAIN/<kelas>/*.jpg    # galeri dan data latih
    └── TEST/<kelas>/*.jpg     # query uji (jangan dipakai untuk tuning)
```

- `manifest.csv` dibuat oleh notebook `02_ekstraksi_fitur` dari hasil pembersihan duplikat tim Data
  (`outputs/reports/metadata_dataset_bersih.csv`). Hanya gambar yang tercantum di manifest yang dipakai
  pemodelan: **1.031 TRAIN dan 295 TEST**. Sisa gambar di folder (duplikat yang dikeluarkan) boleh diabaikan.
- Kolom `path` pada manifest relatif terhadap `data/raw/`, misalnya `TRAIN/Batik Bali/0.jpg`.

## Catatan

- Folder lama `data/raw/DATASET/DATASET/` (susunan hasil ekstrak Kaggle) **tidak** ikut di Git.
  Kalau kamu masih memilikinya secara lokal, pindahkan isi `TRAIN` dan `TEST`-nya ke `data/raw/`
  atau ubah `DATA_DIR` di skrip yang memakainya.
- Dataset ini milik pihak ketiga. Periksa lisensi di halaman Kaggle sebelum repo dibuat publik.
