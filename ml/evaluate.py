import numpy as np
from search import compute_cosine_similarity


def precision_at_k(ranked_labels: np.ndarray, query_label, k: int) -> float:
    """Menghitung Precision@K untuk satu kueri."""
    top_k_labels = ranked_labels[:k]
    relevant = np.sum(top_k_labels == query_label)
    return float(relevant) / k


def average_precision(ranked_labels: np.ndarray, query_label) -> float:
    """Menghitung Average Precision (AP) untuk satu kueri."""
    matches = (ranked_labels == query_label).astype(np.float32)
    num_relevant = np.sum(matches)
    if num_relevant == 0:
        return 0.0

    cum_hits = np.cumsum(matches)
    ranks = np.arange(1, len(matches) + 1)
    precisions = cum_hits / ranks
    return float(np.sum(precisions * matches) / num_relevant)


def evaluate_retrieval(
    query_embs: np.ndarray,
    query_labels: np.ndarray,
    gallery_embs: np.ndarray,
    gallery_labels: np.ndarray,
    ks=(5, 10)
) -> dict:
    """Mengevaluasi performa retrieval secara keseluruhan (P@K dan mAP)."""
    sim_matrix = compute_cosine_similarity(query_embs, gallery_embs)
    ranked_indices = np.argsort(sim_matrix, axis=1)[:, ::-1]

    p_at_k_scores = {f"P@{k}": [] for k in ks}
    ap_scores = []

    for i, q_label in enumerate(query_labels):
        ranked_labels = gallery_labels[ranked_indices[i]]
        for k in ks:
            p_at_k_scores[f"P@{k}"].append(precision_at_k(ranked_labels, q_label, k))
        ap_scores.append(average_precision(ranked_labels, q_label))

    metrics = {k: float(np.mean(v)) for k, v in p_at_k_scores.items()}
    metrics["mAP"] = float(np.mean(ap_scores))
    return metrics
