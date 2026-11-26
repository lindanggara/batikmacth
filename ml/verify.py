"""Bukti bahwa kode di folder ml sama dengan notebook: hitung ulang metrik TEST dan bandingkan
dengan artifacts/results_test.csv (keluaran notebook 04).

    python -m ml.verify
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import torch

from .embedding import extract_embeddings, load_model, make_loader
from .evaluate import evaluate_retrieval

ROOT = Path(__file__).resolve().parents[1]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--artifacts", default=str(ROOT / "artifacts"))
    ap.add_argument("--data-dir", default=str(ROOT / "data" / "raw"))
    ap.add_argument("--manifest", default=str(ROOT / "data" / "manifest.csv"))
    ap.add_argument("--tol", type=float, default=1e-3)
    a = ap.parse_args()

    art, device = Path(a.artifacts), ("cuda" if torch.cuda.is_available() else "cpu")
    cfg = json.load(open(art / "final_config.json"))
    df = pd.read_csv(a.manifest)
    test_df = df[df["split"] == "test"].reset_index(drop=True)
    gallery_df = pd.read_csv(art / "embeddings" / "final_gallery_manifest.csv")
    g_ref = np.load(art / "embeddings" / "final_gallery.npy")
    classes = sorted(set(df["class"].tolist()))

    model = load_model(art / "models" / "final.pt", cfg["backbone"], len(classes), device)

    chk = extract_embeddings(model, make_loader(gallery_df.iloc[:64], a.data_dir), device)
    diff = float(np.abs(chk - g_ref[:64]).max())
    print(f"selisih maksimum embedding galeri (64 gambar): {diff:.2e}")

    q = extract_embeddings(model, make_loader(test_df, a.data_dir), device)
    m = evaluate_retrieval(q, test_df["class"].to_numpy(), g_ref, gallery_df["class"].to_numpy())
    ref = pd.read_csv(art / "results_test.csv").set_index("metrik")["nilai"]

    ok = diff < a.tol
    for k in ["P@5", "P@10", "mAP"]:
        d = abs(m[k] - float(ref[k]))
        ok &= d <= a.tol
        print(f"{k:5s} ml={m[k]:.4f}  notebook 04={float(ref[k]):.4f}  selisih={d:.4f}")
    print("HASIL:", "LULUS, kode ml sama dengan notebook" if ok else "GAGAL, ada perbedaan, periksa kode")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
