# LAPORAN PENGERJAAN
# BATIKMATCH – DATA PREPARATION & EVALUATION

**Penanggung Jawab:** Orang 1 – Data & Evaluasi  
**Proyek:** BatikMatch – Image Retrieval  
**Repository:** `batikmacth`

---

## 1. Pendahuluan

BatikMatch merupakan proyek pencarian gambar (*image retrieval*) untuk menemukan gambar batik yang memiliki kelas atau motif yang sama berdasarkan gambar query yang diberikan.

Dalam proyek ini, tugas Orang 1 berfokus pada persiapan dataset dan evaluasi performa sistem. Tahapan yang dilakukan meliputi pemeriksaan dataset, Exploratory Data Analysis (EDA), deteksi duplikasi, pencegahan data leakage, pembersihan dataset, validasi dataset, serta pembuatan model baseline menggunakan metode Color Histogram.

Baseline Color Histogram digunakan sebagai model pembanding non-neural sebelum dilakukan evaluasi terhadap model berbasis CNN.

## 2. Struktur Dataset Awal

Dataset yang digunakan berasal dari dataset batik Kaggle. Proyek ini menggunakan folder `DATASET` yang memiliki dua bagian utama:

- `TRAIN`: digunakan sebagai gallery atau kumpulan gambar referensi.
- `TEST`: digunakan sebagai query atau gambar yang akan dicari kemiripannya.

Struktur dataset awal:

```text
data/
└── raw/
    └── DATASET/
        └── DATASET/
            ├── TRAIN/
            │   ├── Batik Bali/
            │   ├── Batik Betawi/
            │   ├── ...
            │   └── Batik Tambal/
            └── TEST/
                ├── Batik Bali/
                ├── Batik Betawi/
                ├── ...
                └── Batik Tambal/
```

Dataset terdiri dari 15 kelas batik.

**Catatan:** TRAIN diperlakukan sebagai gallery, sedangkan TEST diperlakukan sebagai query. Evaluasi retrieval dilakukan dengan menganggap gambar relevan apabila kelas gambar hasil pencarian sama dengan kelas gambar query.

## 3. Exploratory Data Analysis (EDA)

### 3.1 Tujuan

EDA dilakukan untuk mengetahui kondisi awal dataset sebelum digunakan dalam eksperimen image retrieval.

Pemeriksaan mencakup:

- Jumlah gambar dan jumlah kelas.
- Distribusi gambar pada setiap kelas.
- Format dan mode warna gambar.
- Resolusi gambar.
- Ukuran file gambar.
- Gambar rusak atau tidak dapat dibaca.
- Duplikasi gambar.

### 3.2 Implementasi

Script yang digunakan:

```text
src/eda.py
```

Perintah untuk menjalankan:

```powershell
python src/eda.py
```

### 3.3 Hasil EDA

Hasil pemeriksaan dataset awal:

| Informasi | Hasil |
|---|---:|
| Total gambar valid | 1.350 |
| Jumlah kelas | 15 |
| Jumlah TRAIN | 1.050 |
| Jumlah TEST | 300 |
| Gambar rusak | 0 |
| Format JPEG | 1.350 |
| Mode RGB | 1.350 |
| Resolusi 224 × 224 | 1.350 |
| Total ukuran dataset | 42,57 MB |

Distribusi awal setiap kelas:

| Kelas | TRAIN | TEST |
|---|---:|---:|
| Batik Bali | 70 | 20 |
| Batik Betawi | 70 | 20 |
| Batik Cendrawasih | 70 | 20 |
| Batik Dayak | 70 | 20 |
| Batik Geblek Renteng | 70 | 20 |
| Batik Ikat Celup | 70 | 20 |
| Batik Insang | 70 | 20 |
| Batik Kawung | 70 | 20 |
| Batik Lasem | 70 | 20 |
| Batik Megamendung | 70 | 20 |
| Batik Pala | 70 | 20 |
| Batik Parang | 70 | 20 |
| Batik Poleng | 70 | 20 |
| Batik Sekar Jagad | 70 | 20 |
| Batik Tambal | 70 | 20 |
| **Total** | **1.050** | **300** |

Semua kelas memiliki jumlah gambar yang sama pada dataset awal. Seluruh gambar memiliki format JPEG, mode RGB, dan resolusi 224 × 224 piksel.

### 3.4 Hasil Visualisasi EDA

Visualisasi yang dihasilkan:

```text
outputs/
└── figures/
    ├── distribusi_kelas.png
    ├── resolusi_gambar.png
    ├── sampel_motif_batik.png
    └── ukuran_file.png
```

Visualisasi tersebut digunakan untuk membantu memahami distribusi kelas, karakteristik gambar, dan kondisi dataset secara keseluruhan.

## 4. Deteksi Duplikasi dan Data Leakage

### 4.1 Tujuan

Pemeriksaan duplikasi dilakukan untuk menemukan gambar yang memiliki konten identik, baik dalam folder TRAIN, dalam folder TEST, maupun di antara kedua folder tersebut.

Pemeriksaan ini penting karena adanya gambar yang sama pada TRAIN dan TEST dapat menyebabkan data leakage. Kondisi tersebut dapat membuat evaluasi retrieval menjadi tidak objektif.

### 4.2 Metode

Deteksi duplikasi menggunakan nilai hash SHA256 dari file gambar.

Gambar yang memiliki nilai SHA256 sama dianggap sebagai file dengan konten identik.

Script yang digunakan:

```text
src/duplicate_check.py
```

Perintah:

```powershell
python src/duplicate_check.py
```

### 4.3 Hasil Pemeriksaan

| Jenis Pemeriksaan | Jumlah |
|---|---:|
| Duplikasi TRAIN-TRAIN | 18 |
| Duplikasi TEST-TEST | 0 |
| Duplikasi TRAIN-TEST (Leakage) | 5 |
| Kelompok dengan perbedaan label | 0 |

Ditemukan 23 kelompok duplikasi yang melibatkan 47 file gambar.

Dari hasil tersebut, terdapat 5 kelompok duplikasi lintas TRAIN dan TEST yang berpotensi menyebabkan data leakage.

Detail gambar yang terdeteksi:

| Kelas | File TRAIN | File TEST |
|---|---|---|
| Batik Tambal | 31.jpg | 75.jpg |
| Batik Tambal | 55.jpg | 86.jpg |
| Batik Tambal | 9.jpg | 81.jpg |
| Batik Cendrawasih | 52.jpg | 74.jpg |
| Batik Ikat Celup | 53.jpg | 80.jpg |

Tidak ditemukan kelompok duplikasi yang memiliki perbedaan label.

### 4.4 File Laporan

```text
outputs/reports/
├── detail_semua_duplikasi.csv
├── duplikasi_gambar.csv
└── duplikasi_lintas_train_test.csv
```

File tersebut menyimpan hasil pemeriksaan duplikasi dan detail pasangan gambar yang terdeteksi.

## 5. Data Cleaning

### 5.1 Tujuan

Data cleaning dilakukan untuk menghasilkan dataset yang lebih bersih dan menghindari penggunaan gambar duplikat dalam eksperimen retrieval.

Dataset mentah tetap dipertahankan. Proses pembersihan dilakukan dengan menyalin gambar yang lolos pemeriksaan ke direktori baru.

### 5.2 Strategi Pembersihan

Strategi yang digunakan:

1. Menghapus duplikasi internal TRAIN dengan mempertahankan satu file untuk setiap nilai hash yang sama.
2. Mengeluarkan gambar TEST yang memiliki hash sama dengan gambar TRAIN.
3. Menghapus duplikasi internal TEST jika ditemukan.
4. Mempertahankan struktur folder dan nama kelas.
5. Menyalin gambar tanpa mengubah konten aslinya.

Script yang digunakan:

```text
src/clean_dataset.py
```

Perintah:

```powershell
python src/clean_dataset.py
```

### 5.3 Hasil Data Cleaning

| Keterangan | Sebelum | Sesudah |
|---|---:|---:|
| TRAIN | 1.050 | 1.031 |
| TEST | 300 | 295 |
| Total | 1.350 | 1.326 |

Total gambar yang dikeluarkan adalah 24 file, dengan rincian:

- 19 file duplikasi internal TRAIN.
- 5 file duplikasi lintas TRAIN-TEST yang dikeluarkan dari TEST.
- Tidak ada duplikasi internal TEST.

### 5.4 Distribusi Dataset Bersih

| Kelas | TRAIN | TEST |
|---|---:|---:|
| Batik Bali | 70 | 20 |
| Batik Betawi | 70 | 20 |
| Batik Cendrawasih | 70 | 19 |
| Batik Dayak | 70 | 20 |
| Batik Geblek Renteng | 70 | 20 |
| Batik Ikat Celup | 64 | 19 |
| Batik Insang | 70 | 20 |
| Batik Kawung | 70 | 20 |
| Batik Lasem | 69 | 20 |
| Batik Megamendung | 70 | 20 |
| Batik Pala | 68 | 20 |
| Batik Parang | 70 | 20 |
| Batik Poleng | 70 | 20 |
| Batik Sekar Jagad | 66 | 20 |
| Batik Tambal | 64 | 17 |
| **Total** | **1.031** | **295** |

### 5.5 Lokasi Dataset Bersih

```text
data/
└── processed/
    └── clean_dataset/
        ├── TRAIN/
        │   ├── Batik Bali/
        │   ├── Batik Betawi/
        │   ├── ...
        │   └── Batik Tambal/
        └── TEST/
            ├── Batik Bali/
            ├── Batik Betawi/
            ├── ...
            └── Batik Tambal/
```

Dataset bersih ini menjadi dataset utama yang digunakan dalam eksperimen baseline dan diharapkan menjadi dataset evaluasi bersama untuk model CNN.

## 6. Validasi Dataset Bersih

### 6.1 Tujuan

Setelah proses cleaning, dilakukan validasi untuk memastikan dataset benar-benar bersih dan dapat digunakan dalam eksperimen.

### 6.2 Pemeriksaan

Validasi mencakup:

- Jumlah gambar TRAIN dan TEST.
- Keberadaan seluruh 15 kelas.
- Duplikasi internal TRAIN.
- Duplikasi internal TEST.
- Duplikasi lintas TRAIN dan TEST.
- Kondisi file gambar yang dapat dibaca.

Script yang digunakan:

```text
src/validate_clean_dataset.py
```

Perintah:

```powershell
python src/validate_clean_dataset.py
```

### 6.3 Hasil Validasi

| Pemeriksaan | Hasil |
|---|---:|
| Jumlah TRAIN | 1.031 |
| Jumlah TEST | 295 |
| Total gambar | 1.326 |
| Duplikasi internal TRAIN | 0 |
| Duplikasi internal TEST | 0 |
| Hash sama TRAIN-TEST | 0 |
| Gambar rusak | 0 |
| Jumlah kelas | 15 |

**Status: VALIDASI BERHASIL**

Seluruh pemeriksaan menunjukkan bahwa dataset bersih tidak memiliki duplikasi internal maupun duplikasi lintas TRAIN dan TEST. Semua gambar dapat dibaca dan seluruh kelas tetap tersedia.

## 7. Baseline Color Histogram

### 7.1 Tujuan

Baseline Color Histogram dibuat sebagai model pembanding non-neural untuk sistem image retrieval BatikMatch.

Metode ini digunakan untuk mengukur kemampuan pencarian gambar berdasarkan distribusi warna sebelum dibandingkan dengan pendekatan berbasis CNN.

### 7.2 Konsep Metode

Setiap gambar diubah ke format RGB, kemudian dihitung histogram untuk masing-masing channel:

- Red (R)
- Green (G)
- Blue (B)

Setiap channel menggunakan 8 bin histogram. Dengan demikian, setiap gambar menghasilkan:

```text
3 channel × 8 bin = 24 fitur
```

Histogram dari ketiga channel digabungkan menjadi satu vektor fitur dan dinormalisasi.

Selanjutnya, kemiripan antara gambar query dan seluruh gambar gallery dihitung menggunakan Cosine Similarity.

Gambar gallery diurutkan berdasarkan nilai similarity tertinggi.

### 7.3 Dataset yang Digunakan

Baseline menggunakan dataset hasil cleaning:

| Komponen | Jumlah |
|---|---:|
| Gallery (TRAIN) | 1.031 |
| Query (TEST) | 295 |
| Kelas | 15 |
| Dimensi fitur | 24 |

### 7.4 Implementasi

Script:

```text
src/baseline_color_histogram.py
```

Perintah menjalankan:

```powershell
python src/baseline_color_histogram.py
```

Tahapan proses:

1. Memuat gambar gallery dari TRAIN.
2. Memuat gambar query dari TEST.
3. Mengekstraksi histogram RGB.
4. Menghasilkan vektor fitur berdimensi 24.
5. Menghitung Cosine Similarity.
6. Mengurutkan hasil pencarian.
7. Menghitung Precision@K, Recall@K, dan Average Precision.
8. Menghitung mean Average Precision (mAP).
9. Menyimpan hasil evaluasi dan visualisasi retrieval.

Nilai K yang digunakan:

```text
K = 1, 5, 10
```

### 7.5 Metrik Evaluasi

**Precision@K**

Mengukur proporsi gambar relevan di antara K gambar teratas yang dikembalikan.

**Recall@K**

Mengukur proporsi gambar relevan yang berhasil ditemukan di antara seluruh gambar relevan dalam gallery.

**Average Precision (AP)**

Mengukur kualitas urutan hasil retrieval untuk satu query berdasarkan posisi gambar-gambar relevan.

**Mean Average Precision (mAP)**

Merupakan rata-rata nilai AP dari seluruh query.

Gambar dianggap relevan apabila label kelasnya sama dengan label kelas query.

### 7.6 Hasil Evaluasi Baseline

Hasil eksperimen yang diperoleh:

| Metrik | Nilai | Persentase |
|---|---:|---:|
| Precision@1 | 0.2508 | 25,08% |
| Precision@5 | 0.1736 | 17,36% |
| Precision@10 | 0.1464 | 14,64% |
| Recall@1 | 0.0037 | 0,37% |
| Recall@5 | 0.0126 | 1,26% |
| Recall@10 | 0.0213 | 2,13% |
| **mAP** | **0.0991** | **9,91%** |

Hasil tersebut menunjukkan bahwa baseline Color Histogram memperoleh mAP sebesar 0,0991 atau 9,91%.

### 7.7 Analisis Hasil

Nilai mAP sebesar 9,91% menunjukkan bahwa metode Color Histogram masih memiliki keterbatasan dalam menemukan gambar batik dengan kelas yang sama berdasarkan distribusi warna saja.

Hal ini dapat terjadi karena gambar batik tidak hanya memiliki karakteristik warna, tetapi juga memiliki pola, bentuk, susunan motif, dan detail visual yang menjadi pembeda antar kelas.

Histogram warna hanya menggambarkan distribusi warna secara keseluruhan dan belum mampu merepresentasikan struktur motif secara mendalam.

Oleh karena itu, baseline ini akan digunakan sebagai pembanding terhadap model CNN yang menggunakan fitur visual hasil ekstraksi jaringan neural.

### 7.8 File Output

Hasil baseline disimpan di:

```text
outputs/
└── baseline_color_histogram/
    ├── evaluasi_per_query.csv
    ├── hasil_top10_retrieval.csv
    ├── ringkasan_metrik.csv
    └── contoh_retrieval.png
```

Keterangan:

| File | Kegunaan |
|---|---|
| `evaluasi_per_query.csv` | Menyimpan hasil evaluasi setiap query |
| `hasil_top10_retrieval.csv` | Menyimpan hasil pencarian Top-10 |
| `ringkasan_metrik.csv` | Menyimpan rata-rata metrik evaluasi |
| `contoh_retrieval.png` | Visualisasi satu query dan hasil Top-5 retrieval |

## 8. Rekapitulasi File Pekerjaan

Seluruh script dan laporan yang telah dibuat:

```text
src/
├── eda.py
├── duplicate_check.py
├── clean_dataset.py
├── validate_clean_dataset.py
└── baseline_color_histogram.py

outputs/
├── baseline_color_histogram/
│   ├── contoh_retrieval.png
│   ├── evaluasi_per_query.csv
│   ├── hasil_top10_retrieval.csv
│   └── ringkasan_metrik.csv
│
├── figures/
│   ├── distribusi_kelas.png
│   ├── resolusi_gambar.png
│   ├── sampel_motif_batik.png
│   └── ukuran_file.png
│
└── reports/
    ├── dataset_stats.json
    ├── detail_semua_duplikasi.csv
    ├── distribusi_kelas.csv
    ├── duplikasi_dikeluarkan.csv
    ├── duplikasi_gambar.csv
    ├── duplikasi_lintas_train_test.csv
    ├── gambar_rusak.csv
    ├── hasil_pemeriksaan_leakage.csv
    ├── metadata_dataset.csv
    ├── metadata_dataset_bersih.csv
    └── resolusi_gambar.csv
```

## 9. Status Pengerjaan Orang 1

| No. | Pekerjaan | Status |
|---|---|---|
| 1 | Pemeriksaan dan pemilihan dataset | Selesai |
| 2 | Exploratory Data Analysis | Selesai |
| 3 | Pemeriksaan distribusi kelas | Selesai |
| 4 | Deteksi duplikasi gambar | Selesai |
| 5 | Pemeriksaan data leakage | Selesai |
| 6 | Data cleaning | Selesai |
| 7 | Validasi dataset bersih | Selesai |
| 8 | Pembuatan baseline Color Histogram | Selesai |
| 9 | Evaluasi Precision@K, Recall@K, dan mAP baseline | Selesai |
| 10 | Evaluasi model CNN | Menunggu model CNN |
| 11 | Perbandingan baseline dengan CNN | Menunggu evaluasi CNN |
| 12 | Analisis retrieval berhasil dan gagal | Perlu dilengkapi |
| 13 | Persiapan query untuk demo | Perlu dilengkapi |
| 14 | Dokumentasi hasil akhir evaluasi | Dalam proses |

## 10. Pekerjaan Selanjutnya

Setelah baseline Color Histogram selesai, tahap berikutnya adalah melakukan evaluasi terhadap model CNN yang dikembangkan oleh anggota tim bagian Model Engineer.

Evaluasi CNN harus menggunakan:

- Dataset gallery yang sama, yaitu TRAIN bersih sebanyak 1.031 gambar.
- Dataset query yang sama, yaitu TEST bersih sebanyak 295 gambar.
- Definisi relevansi yang sama, yaitu kelas gambar harus sama.
- Metrik evaluasi yang sama: Precision@1, Precision@5, Precision@10, Recall@1, Recall@5, Recall@10, dan mAP.

Hasil evaluasi CNN kemudian dibandingkan dengan baseline Color Histogram untuk mengetahui peningkatan kualitas sistem retrieval.

Selain itu, perlu dilakukan analisis terhadap contoh retrieval yang berhasil maupun gagal untuk mengetahui karakteristik gambar yang masih sulit dikenali oleh sistem.

## 11. Kesimpulan

Berdasarkan seluruh tahapan yang telah dilakukan, dataset awal BatikMatch yang berjumlah 1.350 gambar berhasil diperiksa dan dibersihkan menjadi 1.326 gambar, terdiri dari 1.031 gambar gallery dan 295 gambar query.

Proses deteksi duplikasi menemukan 19 file duplikasi internal TRAIN dan 5 file duplikasi lintas TRAIN-TEST. Setelah dilakukan pembersihan, validasi menunjukkan tidak terdapat duplikasi internal maupun lintas dataset, serta tidak ditemukan gambar rusak.

Selanjutnya, baseline Color Histogram berhasil dibangun menggunakan 24 fitur histogram RGB dan Cosine Similarity. Hasil evaluasi memperoleh mAP sebesar 0,0991 atau 9,91%.

Hasil baseline ini menjadi acuan awal untuk membandingkan performa model CNN pada sistem BatikMatch.

Dengan demikian, tahapan persiapan data dan eksperimen baseline dari bagian Data & Evaluasi telah selesai dilaksanakan. Tahapan berikutnya adalah evaluasi model CNN dan analisis perbandingan hasil retrieval.

---

**Dokumen ini merupakan catatan progres pengerjaan Orang 1 – Data & Evaluasi BatikMatch. Hasil dan angka yang tercantum berdasarkan output eksperimen yang telah dijalankan.**
