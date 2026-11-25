# BATIKMATCH - BASELINE COLOR HISTOGRAM
# Image Retrieval menggunakan RGB Histogram + Cosine Similarity

from pathlib import Path

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from PIL import Image
from sklearn.metrics.pairwise import cosine_similarity



# 1. KONFIGURASI


ROOT_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = ROOT_DIR / "data" / "processed" / "clean_dataset"

TRAIN_DIR = DATA_DIR / "TRAIN"
TEST_DIR = DATA_DIR / "TEST"

OUTPUT_DIR = ROOT_DIR / "outputs" / "baseline_color_histogram"

K_VALUES = [1, 5, 10]

BINS = 8

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}



# 2. MEMBACA DATASET

def load_dataset(split_dir):

    image_paths = []

    for label_dir in sorted(split_dir.iterdir()):

        if not label_dir.is_dir():
            continue

        for image_path in sorted(label_dir.iterdir()):

            if image_path.suffix.lower() in IMAGE_EXTENSIONS:

                image_paths.append({
                    "path": image_path,
                    "label": label_dir.name,
                    "filename": image_path.name
                })

    return image_paths



# 3. EKSTRAKSI COLOR HISTOGRAM

def extract_color_histogram(image_path):

    image = Image.open(image_path).convert("RGB")

    image_array = np.asarray(image)

    features = []

    # Histogram masing-masing channel RGB
    for channel in range(3):

        histogram, _ = np.histogram(
            image_array[:, :, channel],
            bins=BINS,
            range=(0, 256)
        )

        features.extend(histogram)

    features = np.array(features, dtype=np.float32)

    # Normalisasi histogram
    total = features.sum()

    if total > 0:
        features = features / total

    return features



# 4. EKSTRAKSI FITUR GALLERY DAN QUERY

def extract_features(dataset, name):

    features = []

    print(f"\nMengekstraksi fitur {name}...")

    for index, item in enumerate(dataset):

        feature = extract_color_histogram(item["path"])

        features.append(feature)

        if (index + 1) % 100 == 0 or index + 1 == len(dataset):
            print(
                f"Progress {name}: "
                f"{index + 1}/{len(dataset)}"
            )

    return np.array(features, dtype=np.float32)



# 5. EVALUASI IMAGE RETRIEVAL


def evaluate_retrieval(
    query_features,
    gallery_features,
    queries,
    gallery
):

    print("\nMenghitung cosine similarity...")

    similarity_matrix = cosine_similarity(
        query_features,
        gallery_features
    )

    print("Menghitung ranking dan metrik evaluasi...")

    query_results = []
    retrieval_results = []

    total_queries = len(queries)

    for query_index, query in enumerate(queries):

        similarities = similarity_matrix[query_index]

        # Ranking berdasarkan similarity tertinggi
        ranked_indices = np.argsort(
            -similarities,
            kind="stable"
        )

        gallery_labels = np.array([
            item["label"] for item in gallery
        ])

        # Relevan jika label sama dengan query
        relevance = (
            gallery_labels[ranked_indices] == query["label"]
        ).astype(int)

        total_relevant = int(relevance.sum())

        if total_relevant == 0:
            raise ValueError(
                f"Tidak ada gallery relevan untuk {query['path']}"
            )

        # Precision pada setiap posisi ranking
        cumulative_relevant = np.cumsum(relevance)

        precision_at_rank = (
            cumulative_relevant /
            np.arange(1, len(relevance) + 1)
        )

        # Average Precision untuk seluruh ranking
        average_precision = (
            np.sum(precision_at_rank * relevance)
            / total_relevant
        )

        result = {
            "query_filename": query["filename"],
            "query_label": query["label"],
            "total_relevant": total_relevant,
            "AP": average_precision
        }

        # Precision@K dan Recall@K
        for k in K_VALUES:

            relevant_at_k = int(relevance[:k].sum())

            precision_k = relevant_at_k / k

            recall_k = relevant_at_k / total_relevant

            result[f"Precision@{k}"] = precision_k
            result[f"Recall@{k}"] = recall_k

        query_results.append(result)

        # Simpan hasil Top 10 setiap query
        top_k = min(10, len(gallery))

        for rank, gallery_index in enumerate(
            ranked_indices[:top_k],
            start=1
        ):

            retrieved = gallery[gallery_index]

            retrieval_results.append({
                "query_filename": query["filename"],
                "query_label": query["label"],
                "rank": rank,
                "retrieved_filename": retrieved["filename"],
                "retrieved_label": retrieved["label"],
                "similarity": float(
                    similarities[gallery_index]
                ),
                "relevant": int(
                    retrieved["label"] == query["label"]
                )
            })

        if (query_index + 1) % 25 == 0 or query_index + 1 == total_queries:
            print(
                f"Progress evaluasi: "
                f"{query_index + 1}/{total_queries}"
            )

    return query_results, retrieval_results



# 6. VISUALISASI HASIL RETRIEVAL

def visualize_retrieval(
    query,
    gallery,
    gallery_features,
    query_feature
):

    similarities = cosine_similarity(
        query_feature.reshape(1, -1),
        gallery_features
    )[0]

    ranked_indices = np.argsort(
        -similarities,
        kind="stable"
    )[:5]

    fig, axes = plt.subplots(
        1, 6,
        figsize=(18, 4)
    )

    # Gambar query
    query_image = Image.open(
        query["path"]
    ).convert("RGB")

    axes[0].imshow(query_image)
    axes[0].set_title(
        f"QUERY\n{query['label']}",
        fontsize=9
    )
    axes[0].axis("off")

    # Lima hasil retrieval
    for position, gallery_index in enumerate(
        ranked_indices,
        start=1
    ):

        item = gallery[gallery_index]

        image = Image.open(
            item["path"]
        ).convert("RGB")

        axes[position].imshow(image)

        is_relevant = item["label"] == query["label"]

        status = "Benar" if is_relevant else "Salah"

        axes[position].set_title(
            f"Rank {position}\n"
            f"{item['label']}\n"
            f"Sim: {similarities[gallery_index]:.3f}\n"
            f"{status}",
            fontsize=8
        )

        axes[position].axis("off")

    plt.suptitle(
        "BATIKMATCH - BASELINE COLOR HISTOGRAM",
        fontsize=13
    )

    plt.tight_layout()

    output_path = OUTPUT_DIR / "contoh_retrieval.png"

    plt.savefig(
        output_path,
        dpi=200,
        bbox_inches="tight"
    )

    plt.close()

    print("\nVisualisasi tersimpan:", output_path)



# 7. PROGRAM UTAMA

def main():

    print("=" * 65)
    print("BATIKMATCH - BASELINE COLOR HISTOGRAM")
    print("=" * 65)

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    # Validasi folder
    if not TRAIN_DIR.exists() or not TEST_DIR.exists():

        raise FileNotFoundError(
            "Folder TRAIN atau TEST tidak ditemukan!"
        )

    # Membaca dataset
    gallery = load_dataset(TRAIN_DIR)
    queries = load_dataset(TEST_DIR)

    print("\n[1] INFORMASI DATASET")
    print("Jumlah gallery :", len(gallery))
    print("Jumlah query   :", len(queries))
    print("Jumlah kelas   :", len(set(
        item["label"] for item in gallery
    )))

    if not gallery or not queries:
        raise ValueError("Dataset TRAIN atau TEST kosong!")

    # Ekstraksi fitur
    print("\n[2] EKSTRAKSI FITUR")

    gallery_features = extract_features(
        gallery,
        "GALLERY"
    )

    query_features = extract_features(
        queries,
        "QUERY"
    )

    print("\nDimensi fitur gallery :", gallery_features.shape)
    print("Dimensi fitur query   :", query_features.shape)

    # Evaluasi
    print("\n[3] EVALUASI RETRIEVAL")

    query_results, retrieval_results = evaluate_retrieval(
        query_features,
        gallery_features,
        queries,
        gallery
    )

    # DataFrame
    results_df = pd.DataFrame(query_results)

    retrieval_df = pd.DataFrame(retrieval_results)

    # Ringkasan metrik
    metric_columns = [
        "AP",
        *[f"Precision@{k}" for k in K_VALUES],
        *[f"Recall@{k}" for k in K_VALUES]
    ]

    summary = results_df[metric_columns].mean().to_frame(
        name="nilai"
    )

    summary.loc["mAP", "nilai"] = results_df["AP"].mean()

    # Simpan hasil
    results_df.to_csv(
        OUTPUT_DIR / "evaluasi_per_query.csv",
        index=False
    )

    retrieval_df.to_csv(
        OUTPUT_DIR / "hasil_top10_retrieval.csv",
        index=False
    )

    summary.to_csv(
        OUTPUT_DIR / "ringkasan_metrik.csv"
    )

    # Visualisasi satu contoh query
    visualize_retrieval(
        queries[0],
        gallery,
        gallery_features,
        query_features[0]
    )

    # Tampilkan ringkasan
    print("\n[4] HASIL EVALUASI BASELINE")

    print(
        summary.to_string(
            float_format=lambda x: f"{x:.4f}"
        )
    )

    print("\n[5] FILE OUTPUT")
    print("Folder hasil:", OUTPUT_DIR)

    print("\nBaseline Color Histogram selesai!")
    print("=" * 65)


if __name__ == "__main__":
    main()
