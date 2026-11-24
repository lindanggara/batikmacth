import numpy as np
import pandas as pd


def compute_cosine_similarity(query_embs: np.ndarray, gallery_embs: np.ndarray) -> np.ndarray:
    """
    Menghitung matriks Cosine Similarity antara query dan gallery.
    Asumsi: query_embs dan gallery_embs sudah ternormalisasi L2.
    """
    return np.matmul(query_embs, gallery_embs.T)


def search_top_k(
    query_emb: np.ndarray,
    gallery_embs: np.ndarray,
    gallery_df: pd.DataFrame,
    top_k: int = 5
) -> pd.DataFrame:
    """Mencari Top-K citra paling mirip dari galeri untuk satu citra kueri."""
    if query_emb.ndim == 1:
        query_emb = query_emb.reshape(1, -1)

    scores = compute_cosine_similarity(query_emb, gallery_embs).flatten()
    top_indices = np.argsort(scores)[::-1][:top_k]

    results = gallery_df.iloc[top_indices].copy().reset_index(drop=True)
    results["rank"] = np.arange(1, len(results) + 1)
    results["similarity"] = scores[top_indices]
    return results


def batch_retrieve(
    query_embs: np.ndarray,
    gallery_embs: np.ndarray
):
    """Mengembalikan matriks indeks terurut (descending) dan matriks skor kemiripan untuk seluruh kueri."""
    sim_matrix = compute_cosine_similarity(query_embs, gallery_embs)
    ranked_indices = np.argsort(sim_matrix, axis=1)[:, ::-1]
    ranked_scores = np.take_along_axis(sim_matrix, ranked_indices, axis=1)
    return ranked_indices, ranked_scores
