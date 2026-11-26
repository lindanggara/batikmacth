"""Fine-tuning dan pelatihan model final. Logikanya sama dengan notebook 03.

Pemakaian (dari root repo):
    python -m ml.train                      # latih model final (konfigurasi D6) pada seluruh TRAIN bersih
    python -m ml.train --config cfg.json    # konfigurasi lain
"""
import argparse
import copy
import json
import random
from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn as nn

from .embedding import RetrievalNet, extract_embeddings, make_loader
from .evaluate import evaluate_retrieval

ROOT = Path(__file__).resolve().parents[1]

# Konfigurasi terpilih dari validation (notebook 03, rata-rata 3 seed: mAP 0.7385)
DEFAULT_CFG = {
    "tag": "D6_eff_u4_sgd_hi", "backbone": "efficientnet_b0", "n_unfreeze": 4,
    "optimizer": "sgd", "lr": 0.01, "lr_head": 0.01, "augment": True, "epochs": 30,
}


def set_seed(s: int = 42):
    random.seed(s); np.random.seed(s); torch.manual_seed(s); torch.cuda.manual_seed_all(s)


def blocks_of(net):
    b = net.backbone
    return [b.layer1, b.layer2, b.layer3, b.layer4] if net.name == "resnet50" else list(b.features)


def set_trainable(net, n_unfreeze: int):
    """Bekukan backbone, lalu buka n blok terakhir (0 = hanya head yang dilatih)."""
    for p in net.backbone.parameters():
        p.requires_grad = False
    if n_unfreeze > 0:
        for blk in blocks_of(net)[-n_unfreeze:]:
            for p in blk.parameters():
                p.requires_grad = True
    for p in net.head.parameters():
        p.requires_grad = True


def freeze_bn_of_frozen(net):
    """BatchNorm pada bagian yang dibekukan tetap mode eval agar statistiknya tidak berubah."""
    for m in net.backbone.modules():
        if isinstance(m, nn.modules.batchnorm._BatchNorm) and not any(p.requires_grad for p in m.parameters()):
            m.eval()


def make_optimizer(net, cfg):
    groups = [{"params": list(net.head.parameters()), "lr": cfg["lr_head"]}]
    bb = [p for p in net.backbone.parameters() if p.requires_grad]
    if bb:
        groups.append({"params": bb, "lr": cfg["lr"]})
    if cfg["optimizer"] == "adam":
        return torch.optim.Adam(groups)
    return torch.optim.SGD(groups, momentum=0.9, weight_decay=1e-4)


def train_one_epoch(net, loader, opt, crit, device):
    net.train(); freeze_bn_of_frozen(net)
    tot, n = 0.0, 0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        opt.zero_grad()
        loss = crit(net(x), y)
        loss.backward(); opt.step()
        tot += loss.item() * len(y); n += len(y)
    return tot / n


def train_model(train_df, val_df, data_dir, cfg, device=None, seed: int = 42, verbose: bool = True):
    """Latih di train_df (galeri), pilih epoch terbaik dari mAP di val_df.

    Mengembalikan (state_dict terbaik, riwayat per epoch, ringkasan hasil terbaik).
    """
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")
    classes = sorted(set(train_df["class"].tolist()))
    c2i = {c: i for i, c in enumerate(classes)}
    gl, ql = np.array(train_df["class"].tolist()), np.array(val_df["class"].tolist())

    set_seed(seed)
    net = RetrievalNet(cfg["backbone"], len(classes)).to(device)
    set_trainable(net, cfg["n_unfreeze"])
    opt, crit = make_optimizer(net, cfg), nn.CrossEntropyLoss()
    loader = make_loader(train_df, data_dir, c2i, is_train=cfg["augment"], shuffle=True, drop_last=True)
    g_loader, v_loader = make_loader(train_df, data_dir), make_loader(val_df, data_dir)

    history, best, best_state = [], {"mAP": -1.0}, None
    for ep in range(1, cfg["epochs"] + 1):
        loss = train_one_epoch(net, loader, opt, crit, device)
        m = evaluate_retrieval(extract_embeddings(net, v_loader, device), ql,
                               extract_embeddings(net, g_loader, device), gl)
        history.append({"epoch": ep, "loss": loss, **m})
        if verbose:
            print(f"ep {ep:02d}  loss={loss:.4f}  P@5={m['P@5']:.4f}  mAP={m['mAP']:.4f}")
        if m["mAP"] > best["mAP"]:
            best, best_state = {**m, "epoch": ep}, copy.deepcopy(net.state_dict())
    return best_state, history, best


def train_final(manifest_path, data_dir, out_dir, cfg=None, device=None, seed: int = 42, overwrite: bool = False):
    """Latih pada seluruh TRAIN dengan epoch tetap, lalu simpan artefak untuk evaluasi dan backend:
    models/final.pt, embeddings/final_gallery.npy, embeddings/final_gallery_manifest.csv, final_config.json
    """
    cfg = cfg or DEFAULT_CFG
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")
    out_dir = Path(out_dir)
    if (out_dir / "models" / "final.pt").exists() and not overwrite:
        raise FileExistsError("final.pt sudah ada. Pakai --overwrite kalau memang ingin melatih ulang.")

    df = pd.read_csv(manifest_path)
    full_df = df[df["split"] == "train"].reset_index(drop=True)
    classes = sorted(set(df["class"].tolist()))
    c2i = {c: i for i, c in enumerate(classes)}

    set_seed(seed)
    net = RetrievalNet(cfg["backbone"], len(classes)).to(device)
    set_trainable(net, cfg["n_unfreeze"])
    opt, crit = make_optimizer(net, cfg), nn.CrossEntropyLoss()
    loader = make_loader(full_df, data_dir, c2i, is_train=cfg["augment"], shuffle=True, drop_last=True)

    for ep in range(1, cfg["epochs"] + 1):
        print(f"final ep {ep:02d}  loss={train_one_epoch(net, loader, opt, crit, device):.4f}")

    g = extract_embeddings(net, make_loader(full_df, data_dir), device)
    (out_dir / "models").mkdir(parents=True, exist_ok=True)
    (out_dir / "embeddings").mkdir(parents=True, exist_ok=True)
    torch.save(net.state_dict(), out_dir / "models" / "final.pt")
    np.save(out_dir / "embeddings" / "final_gallery.npy", g)
    full_df.to_csv(out_dir / "embeddings" / "final_gallery_manifest.csv", index=False)
    json.dump(cfg, open(out_dir / "final_config.json", "w"), indent=1)
    print("tersimpan:", g.shape, "di", out_dir)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Latih model final Batikmatch pada seluruh TRAIN bersih.")
    ap.add_argument("--manifest", default=str(ROOT / "data" / "manifest.csv"))
    ap.add_argument("--data-dir", default=str(ROOT / "data" / "raw"))
    ap.add_argument("--out", default=str(ROOT / "artifacts"))
    ap.add_argument("--config", default=None, help="file JSON konfigurasi (default: D6)")
    ap.add_argument("--overwrite", action="store_true")
    a = ap.parse_args()
    cfg = json.load(open(a.config)) if a.config else DEFAULT_CFG
    train_final(a.manifest, a.data_dir, a.out, cfg, overwrite=a.overwrite)
