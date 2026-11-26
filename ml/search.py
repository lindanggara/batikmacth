"""Pencarian cosine similarity. Asumsi: semua embedding sudah L2-normal."""
import numpy as np
import pandas as pd


def compute_cosine_similarity(query_embs: np.ndarray, gallery_embs: np.ndarray) -> np.ndarray:
    return np.matmul(query_embs, gallery_embs.T)


def search_top_k(query_emb: np.ndarray, gallery_embs: np.ndarray, gallery_df: pd.DataFrame,
                 top_k: int = 5) -> pd.DataFrame:
    """Top-K gambar galeri paling mirip untuk satu query. gallery_df punya kolom `path` dan `class`."""
    if query_emb.ndim == 1:
        query_emb = query_emb.reshape(1, -1)
    scores = compute_cosine_similarity(query_emb, gallery_embs).flatten()
    top = np.argsort(-scores, kind="stable")[:top_k]
    res = gallery_df.iloc[top].copy().reset_index(drop=True)
    res["rank"] = np.arange(1, len(res) + 1)
    res["similarity"] = scores[top]
    return res


def search_from_embedding(query_emb: np.ndarray, gallery_embs: np.ndarray, gallery_df: pd.DataFrame,
                          top_k: int = 5, min_similarity: float = None) -> dict:
    """Hasil lengkap satu query: Top-K, prediksi kelas (kelas Top-1), dan penanda 'tidak dikenal'.

    min_similarity: kalau kemiripan Top-1 di bawah nilai ini, motif dianggap tidak ada di koleksi.
    """
    res = search_top_k(query_emb, gallery_embs, gallery_df, top_k)
    top1 = float(res["similarity"].iloc[0])
    return {
        "predicted_class": str(res["class"].iloc[0]),
        "top1_similarity": top1,
        "unknown": bool(min_similarity is not None and top1 < min_similarity),
        "results": [
            {"rank": int(r["rank"]), "class": str(r["class"]),
             "similarity": float(r["similarity"]), "path": str(r["path"])}
            for _, r in res.iterrows()
        ],
    }


def batch_retrieve(query_embs: np.ndarray, gallery_embs: np.ndarray):
    """Indeks terurut (menurun) dan skor kemiripan untuk semua query."""
    sim = compute_cosine_similarity(query_embs, gallery_embs)
    ranked = np.argsort(-sim, axis=1, kind="stable")
    return ranked, np.take_along_axis(sim, ranked, axis=1)
