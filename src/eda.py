
# BATIKMATCH
# EXPLORATORY DATA ANALYSIS (EDA)
# Image Retrieval Project

import hashlib
from pathlib import Path

import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image


# 1. KONFIGURASI PATH

ROOT_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = (
    ROOT_DIR / "data" / "raw" / "DATASET" / "DATASET"
)

OUTPUT_DIR = ROOT_DIR / "outputs"
FIGURE_DIR = OUTPUT_DIR / "figures"
REPORT_DIR = OUTPUT_DIR / "reports"

FIGURE_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp"
}


# 2. FUNGSI HASH GAMBAR

def calculate_hash(image_path):

    sha256 = hashlib.sha256()

    with open(image_path, "rb") as file:

        for chunk in iter(
            lambda: file.read(4096), b""
        ):
            sha256.update(chunk)

    return sha256.hexdigest()



# 3. SCANNING DATASET


def scan_dataset():

    records = []
    corrupted_images = []

    for split in ["TRAIN", "TEST"]:

        split_dir = DATA_DIR / split

        if not split_dir.exists():

            raise FileNotFoundError(
                f"Folder tidak ditemukan: {split_dir}"
            )

        classes = sorted(
            folder
            for folder in split_dir.iterdir()
            if folder.is_dir()
        )

        for class_dir in classes:

            label = class_dir.name

            image_files = sorted(
                file
                for file in class_dir.rglob("*")
                if file.is_file()
                and file.suffix.lower() in IMAGE_EXTENSIONS
            )

            for image_path in image_files:

                try:

                    image_hash = calculate_hash(
                        image_path
                    )

                    with Image.open(image_path) as img:

                        img.verify()

                    with Image.open(image_path) as img:

                        width, height = img.size
                        image_format = img.format
                        image_mode = img.mode

                    file_size = image_path.stat().st_size

                    records.append({

                        "split": split,
                        "label": label,
                        "filename": image_path.name,
                        "path": str(
                            image_path.relative_to(ROOT_DIR)
                        ),
                        "width": width,
                        "height": height,
                        "format": image_format,
                        "mode": image_mode,
                        "size_kb": round(
                            file_size / 1024, 2
                        ),
                        "sha256": image_hash

                    })

                except Exception as error:

                    corrupted_images.append({

                        "split": split,
                        "label": label,
                        "filename": image_path.name,
                        "path": str(image_path),
                        "error": str(error)

                    })

    return pd.DataFrame(records), corrupted_images



# 4. MEMERIKSA DATASET

print("=" * 60)
print("BATIKMATCH - EXPLORATORY DATA ANALYSIS")
print("=" * 60)

df, corrupted = scan_dataset()

if df.empty:

    raise ValueError(
        "Tidak ada gambar valid yang ditemukan. "
        "Periksa kembali struktur folder dataset."
    )

print("\n[1] INFORMASI DATASET")

print(f"Total gambar valid : {len(df)}")
print(f"Total kelas        : {df['label'].nunique()}")
print(f"Jumlah TRAIN       : {(df['split'] == 'TRAIN').sum()}")
print(f"Jumlah TEST        : {(df['split'] == 'TEST').sum()}")
print(f"Gambar rusak       : {len(corrupted)}")



# 5. DISTRIBUSI KELAS


print("\n[2] DISTRIBUSI KELAS")

distribution = pd.crosstab(
    df["label"],
    df["split"]
)

distribution = distribution.reindex(
    columns=["TRAIN", "TEST"],
    fill_value=0
)

print(distribution)

distribution.to_csv(
    REPORT_DIR / "distribusi_kelas.csv"
)



# 6. ANALISIS FORMAT GAMBAR


print("\n[3] FORMAT GAMBAR")

print(df["format"].value_counts())

print("\n[4] MODE WARNA")

print(df["mode"].value_counts())



# 7. ANALISIS RESOLUSI


print("\n[5] RESOLUSI GAMBAR")

resolution = (
    df.groupby(["width", "height"])
    .size()
    .reset_index(name="jumlah")
    .sort_values("jumlah", ascending=False)
)

print(resolution)

resolution.to_csv(
    REPORT_DIR / "resolusi_gambar.csv",
    index=False
)



# 8. ANALISIS UKURAN FILE


print("\n[6] STATISTIK UKURAN FILE")

print(df["size_kb"].describe())

print(
    f"\nTotal ukuran gambar: "
    f"{df['size_kb'].sum() / 1024:.2f} MB"
)



# 9. VISUALISASI DISTRIBUSI KELAS


distribution_plot = distribution.sort_index()

ax = distribution_plot.plot(
    kind="bar",
    figsize=(13, 6),
    width=0.8
)

plt.title(
    "Distribusi Dataset Batik Berdasarkan Kelas"
)

plt.xlabel("Kategori Motif Batik")
plt.ylabel("Jumlah Gambar")

plt.xticks(
    rotation=45,
    ha="right"
)

plt.legend(title="Dataset")
plt.tight_layout()

plt.savefig(
    FIGURE_DIR / "distribusi_kelas.png",
    dpi=300
)

plt.show()
plt.close()



# 10. VISUALISASI RESOLUSI GAMBAR


plt.figure(figsize=(9, 5))

plt.scatter(
    df["width"],
    df["height"],
    alpha=0.6
)

plt.title("Distribusi Resolusi Gambar Batik")
plt.xlabel("Lebar Gambar (Pixel)")
plt.ylabel("Tinggi Gambar (Pixel)")

plt.grid(alpha=0.3)
plt.tight_layout()

plt.savefig(
    FIGURE_DIR / "resolusi_gambar.png",
    dpi=300
)

plt.show()
plt.close()



# 11. VISUALISASI UKURAN FILE

plt.figure(figsize=(9, 5))

plt.hist(
    df["size_kb"],
    bins=20,
    edgecolor="black"
)

plt.title("Distribusi Ukuran File Gambar")
plt.xlabel("Ukuran File (KB)")
plt.ylabel("Frekuensi")

plt.tight_layout()

plt.savefig(
    FIGURE_DIR / "ukuran_file.png",
    dpi=300
)

plt.show()
plt.close()


# 12. VISUALISASI SAMPEL GAMBAR


classes = sorted(df["label"].unique())

fig, axes = plt.subplots(
    3, 5,
    figsize=(16, 11)
)

axes = axes.flatten()

for i, label in enumerate(classes):

    sample = df[
        (df["label"] == label) &
        (df["split"] == "TRAIN")
    ].iloc[0]

    image_path = ROOT_DIR / sample["path"]

    with Image.open(image_path) as img:

        axes[i].imshow(
            img.convert("RGB")
        )

    axes[i].set_title(
        label,
        fontsize=9
    )

    axes[i].axis("off")


for i in range(len(classes), len(axes)):

    axes[i].axis("off")


plt.suptitle(
    "Contoh Motif Batik dari Setiap Kategori",
    fontsize=15
)

plt.tight_layout()

plt.savefig(
    FIGURE_DIR / "sampel_motif_batik.png",
    dpi=300
)

plt.show()
plt.close()



# 13. DETEKSI DUPLIKASI GAMBAR

duplicates = df[
    df.duplicated(
        subset="sha256",
        keep=False
    )
].copy()

duplicates = duplicates.sort_values(
    "sha256"
)

duplicates.to_csv(
    REPORT_DIR / "duplikasi_gambar.csv",
    index=False
)

duplicate_group_count = (
    duplicates["sha256"].nunique()
)

cross_split_groups = 0

for _, group in duplicates.groupby("sha256"):

    if group["split"].nunique() > 1:

        cross_split_groups += 1


print("\n[7] HASIL DETEKSI DUPLIKASI")

print(
    f"Jumlah file dalam kelompok duplikat: "
    f"{len(duplicates)}"
)

print(
    f"Jumlah kelompok duplikat: "
    f"{duplicate_group_count}"
)

print(
    f"Kelompok duplikat lintas TRAIN-TEST: "
    f"{cross_split_groups}"
)



# 14. MENYIMPAN METADATA DATASET


df.to_csv(
    REPORT_DIR / "metadata_dataset.csv",
    index=False
)

pd.DataFrame(corrupted).to_csv(
    REPORT_DIR / "gambar_rusak.csv",
    index=False
)



# 15. RINGKASAN EDA

print("\n" + "=" * 60)
print("EDA SELESAI")
print("=" * 60)

print("\nFile laporan tersimpan di:")
print(REPORT_DIR)

print("\nVisualisasi tersimpan di:")
print(FIGURE_DIR)

print("\nSeluruh proses EDA berhasil dijalankan!")
