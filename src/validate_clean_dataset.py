# BATIKMATCH - VALIDASI DATASET BERSIH


from pathlib import Path
from collections import defaultdict
from hashlib import sha256

from PIL import Image

ROOT_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = (
    ROOT_DIR / "data" / "processed" / "clean_dataset"
)

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def calculate_hash(path):
    hasher = sha256()

    with open(path, "rb") as file:
        for chunk in iter(lambda: file.read(8192), b""):
            hasher.update(chunk)

    return hasher.hexdigest()


def scan_split(split):
    split_dir = DATA_DIR / split

    records = []
    damaged = []

    if not split_dir.exists():
        raise FileNotFoundError(
            f"Folder {split} tidak ditemukan: {split_dir}"
        )

    for label_dir in sorted(split_dir.iterdir()):

        if not label_dir.is_dir():
            continue

        for image_path in sorted(label_dir.iterdir()):

            if image_path.suffix.lower() not in IMAGE_EXTENSIONS:
                continue

            try:
                with Image.open(image_path) as image:
                    image.verify()

                records.append({
                    "split": split,
                    "label": label_dir.name,
                    "filename": image_path.name,
                    "path": image_path,
                    "sha256": calculate_hash(image_path)
                })

            except Exception as error:
                damaged.append({
                    "path": str(image_path),
                    "error": str(error)
                })

    return records, damaged


def main():

    print("=" * 60)
    print("BATIKMATCH - VALIDASI DATASET BERSIH")
    print("=" * 60)

    train, damaged_train = scan_split("TRAIN")
    test, damaged_test = scan_split("TEST")

    all_records = train + test
    damaged = damaged_train + damaged_test

    # Pemeriksaan hash
    hashes_by_split = defaultdict(set)
    hash_records = defaultdict(list)

    for record in all_records:
        hashes_by_split[record["split"]].add(
            record["sha256"]
        )

        hash_records[record["sha256"]].append(record)

    train_hashes = hashes_by_split["TRAIN"]
    test_hashes = hashes_by_split["TEST"]

    cross_leakage = train_hashes & test_hashes

    duplicate_train = len(train) - len(train_hashes)
    duplicate_test = len(test) - len(test_hashes)

    # Distribusi kelas
    print("\n[1] JUMLAH DATA")
    print("TRAIN :", len(train))
    print("TEST  :", len(test))
    print("TOTAL :", len(all_records))

    print("\n[2] DISTRIBUSI KELAS")

    distribution = defaultdict(
        lambda: {"TRAIN": 0, "TEST": 0}
    )

    for record in all_records:
        distribution[record["label"]][record["split"]] += 1

    for label in sorted(distribution):
        print(
            f"{label:<22} "
            f"TRAIN: {distribution[label]['TRAIN']:>3} "
            f"TEST: {distribution[label]['TEST']:>3}"
        )

    print("\n[3] PEMERIKSAAN DUPLIKASI")
    print("Duplikat internal TRAIN :", duplicate_train)
    print("Duplikat internal TEST  :", duplicate_test)
    print("Hash sama TRAIN-TEST    :", len(cross_leakage))

    print("\n[4] PEMERIKSAAN GAMBAR")
    print("Gambar rusak :", len(damaged))

    # Hasil akhir
    success = (
        len(cross_leakage) == 0
        and duplicate_train == 0
        and duplicate_test == 0
        and len(damaged) == 0
    )

    print("\n" + "=" * 60)

    if success:
        print("VALIDASI BERHASIL!")
        print("Dataset bersih siap digunakan untuk tahap berikutnya.")
    else:
        print("VALIDASI BELUM LOLOS!")
        print("Periksa kembali hasil pemeriksaan di atas.")

    print("=" * 60)


if __name__ == "__main__":
    main()
