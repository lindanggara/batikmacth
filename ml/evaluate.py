"""Metrik retrieval: Precision@K dan mAP (definisi sama dengan notebook 02 sampai 04)."""
import numpy as np

from .search import compute_cosine_similarity


def precision_at_k(ranked_labels: np.ndarray, query_label, k: int) -> float:
    return float(np.sum(ranked_labels[:k] == query_label)) / k


def average_precision(ranked_labels: np.ndarray, query_label) -> float:
    matches = (ranked_labels == query_label).astype(np.float32)
    n_rel = np.sum(matches)
    if n_rel == 0:
        return 0.0
    precisions = np.cumsum(matches) / np.arange(1, len(matches) + 1)
    return float(np.sum(precisions * matches) / n_rel)


def evaluate_retrieval(query_embs, query_labels, gallery_embs, gallery_labels, ks=(5, 10)) -> dict:
    """Mengembalikan {'P@5':..., 'P@10':..., 'mAP':...} (rata-rata atas query)."""
    query_labels, gallery_labels = np.asarray(query_labels), np.asarray(gallery_labels)
    sim = compute_cosine_similarity(query_embs, gallery_embs)
    ranked = np.argsort(-sim, axis=1, kind="stable")

    p_scores = {f"P@{k}": [] for k in ks}
    aps = []
    for i, y in enumerate(query_labels):
        ranked_labels = gallery_labels[ranked[i]]
        for k in ks:
            p_scores[f"P@{k}"].append(precision_at_k(ranked_labels, y, k))
        aps.append(average_precision(ranked_labels, y))

    out = {k: float(np.mean(v)) for k, v in p_scores.items()}
    out["mAP"] = float(np.mean(aps))
    return out
