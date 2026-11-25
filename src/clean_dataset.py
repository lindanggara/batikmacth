# BATIKMATCH - DATASET CLEANING
# Exact duplicate removal for image retrieval


from pathlib import Path
import pandas as pd
import shutil
import json

ROOT_DIR = Path(__file__).resolve().parents[1]

INPUT_FILE = ROOT_DIR / "outputs" / "reports" / "metadata_dataset.csv"

OUTPUT_DIR = ROOT_DIR / "data" / "processed" / "clean_dataset"

REPORT_DIR = ROOT_DIR / "outputs" / "reports"


def main():

    print("=" * 60)
    print("BATIKMATCH - DATASET CLEANING")
    print("=" * 60)

    if not INPUT_FILE.exists():
        print("metadata_dataset.csv tidak ditemukan!")
        return

    df = pd.read_csv(INPUT_FILE)

    required_columns = {"split", "label", "path", "sha256"}

    if not required_columns.issubset(df.columns):
        print("Kolom metadata tidak lengkap!")
        print("Kolom tersedia:", df.columns.tolist())
        return

    # Pastikan tidak ada hash dengan label berbeda
    label_counts = df.groupby("sha256")["label"].nunique()

    conflict_hashes = label_counts[label_counts > 1]

    if not conflict_hashes.empty:
        print("Ditemukan duplikasi dengan label berbeda.")
        print("Proses dihentikan untuk pemeriksaan manual.")
        return

    # Pisahkan TRAIN dan TEST
    train = df[df["split"] == "TRAIN"].copy()
    test = df[df["split"] == "TEST"].copy()

    # Simpan satu gambar untuk setiap hash di TRAIN
    train_clean = train.drop_duplicates(
        subset="sha256",
        keep="first"
    ).copy()

    # Hash TRAIN menjadi gallery
    train_hashes = set(train_clean["sha256"])

    # Hapus query TEST yang identik dengan gambar TRAIN
    test_without_leakage = test[
        ~test["sha256"].isin(train_hashes)
    ].copy()

    # Jika ada duplikasi internal TEST, simpan satu saja
    test_clean = test_without_leakage.drop_duplicates(
        subset="sha256",
        keep="first"
    ).copy()

    # Catat file yang dikeluarkan
    removed = []

    kept_train_paths = set(train_clean["path"])
    kept_test_paths = set(test_clean["path"])

    for _, row in train.iterrows():
        if row["path"] not in kept_train_paths:
            removed.append({
                "split": "TRAIN",
                "label": row["label"],
                "filename": Path(str(row["path"])).name,
                "path": row["path"],
                "sha256": row["sha256"],
                "reason": "Duplikat dalam TRAIN"
            })

    for _, row in test.iterrows():
        if row["path"] not in kept_test_paths:
            reason = (
                "Identik dengan gambar TRAIN"
                if row["sha256"] in train_hashes
                else "Duplikat dalam TEST"
            )

            removed.append({
                "split": "TEST",
                "label": row["label"],
                "filename": Path(str(row["path"])).name,
                "path": row["path"],
                "sha256": row["sha256"],
                "reason": reason
            })

    # Gabungkan metadata bersih
    clean_df = pd.concat(
        [train_clean, test_clean],
        ignore_index=True
    )

    # Buat folder output baru
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)

    # Salin gambar tanpa mengubah isi/piksel
    for _, row in clean_df.iterrows():

        source = ROOT_DIR / Path(str(row["path"]))

        destination = (
            OUTPUT_DIR
            / str(row["split"])
            / str(row["label"])
            / source.name
        )

        if not source.exists():
            raise FileNotFoundError(
                f"Gambar tidak ditemukan: {source}"
            )

        destination.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        shutil.copy2(source, destination)

    # Simpan laporan
    clean_df.to_csv(
        REPORT_DIR / "metadata_dataset_bersih.csv",
        index=False
    )

    pd.DataFrame(removed).to_csv(
        REPORT_DIR / "duplikasi_dikeluarkan.csv",
        index=False
    )

    stats = {
        "total_train_awal": int(len(train)),
        "total_test_awal": int(len(test)),
        "total_train_bersih": int(len(train_clean)),
        "total_test_bersih": int(len(test_clean)),
        "train_dikeluarkan": int(len(train) - len(train_clean)),
        "test_dikeluarkan": int(len(test) - len(test_clean)),
        "total_gambar_bersih": int(len(clean_df)),
        "jumlah_kelas": int(clean_df["label"].nunique()),
        "distribusi": {}
    }

    for split in ["TRAIN", "TEST"]:
        subset = clean_df[clean_df["split"] == split]

        stats["distribusi"][split] = {
            str(label): int(count)
            for label, count in
            subset["label"].value_counts().sort_index().items()
        }

    with open(
        REPORT_DIR / "dataset_stats.json",
        "w",
        encoding="utf-8"
    ) as file:
        json.dump(stats, file, indent=4, ensure_ascii=False)

    # Ringkasan
    print("\n[1] HASIL PEMBERSIHAN")
    print("TRAIN awal       :", len(train))
    print("TRAIN bersih     :", len(train_clean))
    print("TEST awal        :", len(test))
    print("TEST bersih      :", len(test_clean))
    print("Total bersih     :", len(clean_df))

    print("\n[2] DISTRIBUSI DATA BERSIH")
    print(
        clean_df.groupby(["label", "split"])
        .size()
        .unstack(fill_value=0)
        .to_string()
    )

    print("\n[3] FILE LAPORAN")
    print("Metadata bersih  : metadata_dataset_bersih.csv")
    print("File dikeluarkan : duplikasi_dikeluarkan.csv")
    print("Statistik        : dataset_stats.json")

    print("\nFolder dataset bersih:")
    print(OUTPUT_DIR)

    print("\nPembersihan dataset selesai!")


if __name__ == "__main__":
    main()
