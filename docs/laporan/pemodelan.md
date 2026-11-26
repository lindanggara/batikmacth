# Ringkasan Pemodelan Batikmatch

Pencarian motif batik dari foto dengan **CNN embedding** (neuro computing, transfer learning): EfficientNet-B0 pretrained ImageNet
di-fine-tune untuk mengklasifikasi 15 motif, lalu embedding sebelum layer klasifikasi (1.280 dimensi, L2-normal) dipakai untuk
pencarian cosine similarity terhadap galeri.

## 1. Data

- Sumber: dataset Kaggle *Indonesian Batik Motifs (Corak App)*, 15 kelas, awalnya 1.050 TRAIN dan 300 TEST.
- Pembersihan duplikat (tim Data): 19 gambar TRAIN dan 5 gambar TEST dikeluarkan. Hasil bersih: **1.031 TRAIN dan 295 TEST**.
- Peran data: TRAIN menjadi galeri dan data latih, TEST menjadi query uji.
- Untuk memilih konfigurasi, TRAIN dibagi 80/20 (stratified, seed 42): 824 galeri dan 207 validation. TEST tidak dipakai untuk tuning.

## 2. Metode

1. **Baseline tanpa fine-tuning**: embedding dari CNN pretrained (ResNet50, MobileNetV2, EfficientNet-B0).
2. **Fine-tuning**: bekukan backbone, buka n blok terakhir, latih dengan cross-entropy 15 kelas (head: Dropout 0,2 + Linear).
   Augmentasi: RandomResizedCrop (0,6 sampai 1,0), flip horizontal, color jitter ringan. BatchNorm pada bagian beku tetap mode eval.
3. **Pencarian**: embedding query dibandingkan dengan seluruh galeri memakai cosine similarity, diurutkan menurun.
4. **Evaluasi**: Precision@5, Precision@10, mAP. Relevan berarti kelas gambar hasil sama dengan kelas query.

## 3. Eksperimen (validation, seed 42)

| Tag | Backbone | Blok dibuka | Optimizer | Epoch | P@5 | mAP |
|---|---|---|---|---|---|---|
| **D6** | EfficientNet-B0 | 4 | SGD 0,01 | 30 | 0,8203 | **0,7308** |
| D1 | EfficientNet-B0 | 4 | Adam 1e-4 | 30 | 0,8155 | 0,7238 |
| D2 | EfficientNet-B0 | 6 | Adam 1e-4 | 30 | 0,8029 | 0,7231 |
| D4 | ResNet50 | 3 | Adam 1e-4 | 30 | 0,8106 | 0,6941 |
| D3 | EfficientNet-B0 | 9 | Adam 1e-4 | 30 | 0,7749 | 0,6840 |
| B3 | EfficientNet-B0 | 4 | Adam 1e-4 | 15 | 0,7884 | 0,6756 |
| D5 | MobileNetV2 | 8 | Adam 1e-4 | 30 | 0,7855 | 0,6533 |
| C1 | ResNet50 | 1 | Adam 1e-4 | 15 | 0,7575 | 0,6441 |
| C2 | MobileNetV2 | 4 | Adam 1e-4 | 15 | 0,7227 | 0,5473 |
| B1 | EfficientNet-B0 | 2 | Adam 1e-4 | 15 | 0,7101 | 0,4984 |
| B2 | EfficientNet-B0 | 2 | SGD 1e-3 | 15 | 0,5826 | 0,3235 |
| B4 | EfficientNet-B0 | 2 | Adam (lr sangat kecil) | 15 | 0,5594 | 0,3013 |

Dua kandidat teratas diulang dengan 3 seed (42, 7, 123):

| Konfigurasi | P@5 | P@10 | mAP | Epoch terbaik (rata-rata) |
|---|---|---|---|---|
| **D6** (SGD 0,01) | 0,8267 ± 0,0063 | 0,8092 ± 0,0062 | **0,7385 ± 0,0068** | 28,3 |
| D1 (Adam 1e-4) | 0,8158 ± 0,0034 | 0,8002 ± 0,0012 | 0,7262 ± 0,0023 | 30 |

Pola yang terlihat:
- Membuka lebih banyak blok membantu sampai sekitar 4 sampai 6 blok, lalu menurun (9 blok lebih rendah dari 4 blok).
- Pelatihan 30 epoch lebih baik daripada 15 epoch pada konfigurasi yang sama (B3 vs D1).
- EfficientNet-B0 unggul atas ResNet50 dan MobileNetV2 pada konfigurasi yang diuji (D1 vs D4 vs D5), meski tiap model hanya disetel secukupnya.
- D6 dipilih sebagai konfigurasi final. Selisih mAP-nya dengan D1 sekitar 1,2 poin, atau sekitar 1,8 kali simpangan baku D6, jadi unggul tetapi tidak telak.

## 4. Hasil

**Baseline vs fine-tuning (validation yang sama).** mAP baseline pretrained: EfficientNet-B0 0,2716, ResNet50 0,2579, MobileNetV2 0,2387.

| Tahap | P@5 | P@10 | mAP |
|---|---|---|---|
| Baseline pretrained EfficientNet-B0 (validation) | 0,5411 | 0,4618 | 0,2716 |
| Fine-tuning D6 (validation, rata-rata 3 seed) | 0,8267 | 0,8092 | 0,7385 |
| **Final di TEST** (latih di seluruh TRAIN, galeri 1.031, 295 query) | **0,7864** | **0,7797** | **0,7095** |

Interval kepercayaan 95% di TEST (bootstrap 2.000x atas query): P@5 0,7437 sampai 0,8251; P@10 0,7386 sampai 0,8227; mAP 0,6711 sampai 0,7450.
Akurasi Top-1: 79,3%. Sebanyak 206 dari 295 query (69,8%) mendapat P@5 sempurna.

**Per kelas (TEST).**

| Kelas | AP | Top-1 | Query |
|---|---|---|---|
| Megamendung | 0,970 | 100% | 20 |
| Poleng | 0,960 | 100% | 20 |
| Insang | 0,935 | 95% | 20 |
| Dayak | 0,831 | 95% | 20 |
| Parang | 0,810 | 90% | 20 |
| Tambal | 0,771 | 88% | 17 |
| Geblek Renteng | 0,692 | 85% | 20 |
| Kawung | 0,673 | 80% | 20 |
| Ikat Celup | 0,668 | 74% | 19 |
| Sekar Jagad | 0,658 | 75% | 20 |
| Cendrawasih | 0,646 | 58% | 19 |
| Betawi | 0,583 | 65% | 20 |
| Pala | 0,544 | 70% | 20 |
| Bali | 0,530 | 65% | 20 |
| Lasem | 0,376 | 50% | 20 |

**Pasangan yang paling sering tertukar (Top-1):** Lasem ke Sekar Jagad (4), Bali ke Pala (3), Kawung ke Tambal (3),
lalu 2 kali masing-masing: Bali ke Dayak, Bali ke Cendrawasih, Betawi ke Pala, Cendrawasih ke Dayak, Cendrawasih ke Lasem,
Cendrawasih ke Bali, Lasem ke Bali.

**Pemeriksaan kebocoran TRAIN/TEST.** Masih ada 5 dari 295 query TEST dengan kemiripan >= 0,98 terhadap galeri
(kemungkinan duplikat hasil encode ulang yang lolos deteksi SHA256). Tanpa kelima query itu, P@5 menjadi 0,7828 dan mAP 0,7051,
yaitu selisih sekitar 0,004.

## 5. Keterbatasan

- CI sekitar 8 poin lebar karena hanya 295 query; angka per kelas kasar (satu query setara 5 poin).
- Model final dilatih satu kali (seed 42); tiga seed hanya dipakai pada validation.
- Nilai P@5 validation sedikit lebih tinggi dari TEST (0,827 vs 0,786), wajar karena konfigurasi dan epoch dipilih di validation. Angka TEST adalah hasil resmi.
- Belum diuji pada foto kain asli dari HP (lipatan, bayangan, latar berbeda); seluruh evaluasi memakai gambar dataset.
- Skor cosine model fine-tuned belum dikalibrasi; ambang untuk "motif tidak dikenal" belum ditentukan.
- Model hanya mengenal 15 motif dalam dataset.

## 6. Reproduksi

1. Gambar `data/raw/TRAIN` dan `data/raw/TEST` sudah ada di repo. Notebook 02 membaca `outputs/reports/metadata_dataset_bersih.csv` dari tim Data untuk membuat `data/manifest.csv`.
2. Jalankan notebook `02_ekstraksi_fitur` (membuat `data/manifest.csv` dan baseline), `03_finetuning` (eksperimen dan model final), dan `04_evaluasi` (TEST).
3. Model final juga bisa dilatih dari terminal: `python -m ml.train --out artifacts_repro`, lalu `python -m ml.verify --artifacts artifacts_repro`. Pada komputer dan GPU yang sama, hasilnya identik dengan notebook (embedding galeri dan metrik TEST selisih 0,0000).
