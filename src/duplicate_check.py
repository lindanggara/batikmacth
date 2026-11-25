
# ============================================================
# BATIKMATCH - DUPLICATE CHECK & DATA LEAKAGE ANALYSIS
# ============================================================

from pathlib import Path
import pandas as pd

ROOT_DIR = Path(__file__).resolve().parents[1]
REPORT_DIR = ROOT_DIR / "outputs" / "reports"

INPUT_FILE = REPORT_DIR / "duplikasi_gambar.csv"

OUTPUT_CROSS = REPORT_DIR / "duplikasi_lintas_train_test.csv"
OUTPUT_DETAIL = REPORT_DIR / "detail_semua_duplikasi.csv"


def main():
    print("=" * 60)
    print("BATIKMATCH - DUPLICATE & DATA LEAKAGE ANALYSIS")
    print("=" * 60)

    if not INPUT_FILE.exists():
        print("File duplikasi_gambar.csv tidak ditemukan!")
        return

    df = pd.read_csv(INPUT_FILE)

    # Pastikan hanya kelompok hash yang memiliki lebih dari 1 file
    duplicate_groups = df.groupby("sha256")

    cross_split_groups = []
    duplicate_details = []

    train_train = 0
    test_test = 0
    cross_count = 0
    different_label_groups = 0

    for sha, group in duplicate_groups:
        if len(group) < 2:
            continue

        splits = set(group["split"].astype(str))
        labels = set(group["label"].astype(str))

        if splits == {"TRAIN"}:
            category = "TRAIN-TRAIN"
            train_train += 1

        elif splits == {"TEST"}:
            category = "TEST-TEST"
            test_test += 1

        elif splits == {"TRAIN", "TEST"}:
            category = "TRAIN-TEST"
            cross_count += 1

        else:
            category = "OTHER"

        if len(labels) > 1:
            different_label_groups += 1

        for _, row in group.iterrows():
            duplicate_details.append({
                "sha256": sha,
                "kategori": category,
                "label": row["label"],
                "split": row["split"],
                "filename": row["filename"],
                "path": row["path"]
            })

        if category == "TRAIN-TEST":
            cross_split_groups.append({
                "sha256": sha,
                "jumlah_file": len(group),
                "label": ", ".join(sorted(labels)),
                "file_train": ", ".join(
                    group.loc[group["split"] == "TRAIN", "path"].astype(str)
                ),
                "file_test": ", ".join(
                    group.loc[group["split"] == "TEST", "path"].astype(str)
                )
            })

    # Simpan hasil
    pd.DataFrame(duplicate_details).to_csv(
        OUTPUT_DETAIL, index=False
    )

    pd.DataFrame(cross_split_groups).to_csv(
        OUTPUT_CROSS, index=False
    )

    # Tampilkan ringkasan
    print("\n[1] RINGKASAN KELOMPOK DUPLIKASI")
    print(f"TRAIN-TRAIN              : {train_train}")
    print(f"TEST-TEST                : {test_test}")
    print(f"TRAIN-TEST (LEAKAGE)     : {cross_count}")
    print(f"Kelompok beda label      : {different_label_groups}")

    print("\n[2] DETAIL DUPLIKASI LINTAS TRAIN-TEST")

    if cross_split_groups:
        result = pd.DataFrame(cross_split_groups)
        print(result.to_string(index=False))
    else:
        print("Tidak ditemukan duplikasi lintas TRAIN-TEST.")

    print("\n[3] FILE HASIL")
    print(f"Detail semua duplikasi : {OUTPUT_DETAIL}")
    print(f"Duplikasi lintas split : {OUTPUT_CROSS}")

    print("\nPemeriksaan selesai!")


if __name__ == "__main__":
    main()
