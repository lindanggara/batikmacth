import { KATALOG } from "../data/katalogMotif";
import { resizeImage } from "../utils/resizeImage";
import { API_BASE, getAuthHeaders } from "./client";

// Batas waktu menunggu backend. Model CNN sudah dipanaskan saat server start,
// tapi upload foto dari HP lewat jaringan bisa makan beberapa detik.
const BATAS_WAKTU_MS = 8000;

function hitungSkorMirip(utama, kandidat) {
  let skor = 58;
  if (utama.aliran === kandidat.aliran) skor += 18;
  if (utama.pola === kandidat.pola) skor += 12;
  if ((utama.daerah || "").split(" ")[0] === (kandidat.daerah || "").split(" ")[0]) skor += 7;
  return Math.min(91, skor);
}

// Gabungkan data motif dari backend dengan teks lengkap di katalog lokal.
// Gambar diambil dari galeri backend (foto dataset asli) kalau tersedia.
function gabungMotif(dariBackend) {
  const lokal = KATALOG.find((m) => m.id === dariBackend.id) || {};
  return {
    ...dariBackend,
    ...lokal,
    gambar: dariBackend.gambar ? `${API_BASE}${dariBackend.gambar}` : lokal.gambar,
  };
}

export class GagalPencarian extends Error {}

async function cariDiBackend(file) {
  // Kecilkan foto dulu (sisi terpanjang 1024 px). Backend menolak file di atas 5 MB,
  // dan foto HP sering lebih besar dari itu.
  let kirim = file;
  try {
    kirim = await resizeImage(file, 1024, 0.9);
  } catch {
    // browser lama tanpa createImageBitmap: kirim file asli
  }

  const formData = new FormData();
  formData.append("file", kirim, kirim.name || "foto.jpg");
  formData.append("top_k", "3");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BATAS_WAKTU_MS);
  let res;
  try {
    res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
      signal: controller.signal,
    });
  } catch {
    return null; // backend mati / tidak terjangkau -> pakai mode simulasi
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    // Backend menyala tapi menolak (mis. bukan gambar, terlalu besar): tampilkan pesannya, jangan disamarkan simulasi.
    let pesan = `Pencarian gagal (${res.status}).`;
    try {
      const data = await res.json();
      if (data.detail) pesan = typeof data.detail === "string" ? data.detail : pesan;
    } catch {}
    throw new GagalPencarian(pesan);
  }

  const data = await res.json();
  if (!data.tebakan) {
    throw new GagalPencarian(
      "Server belum memiliki galeri motif untuk dibandingkan. Hubungi pengelola aplikasi."
    );
  }

  return {
    sumber: "backend",
    query_id: data.query_id,
    model: data.model,
    tebakan: gabungMotif(data.tebakan),
    skor: data.skor,
    yakin: data.yakin,
    threshold: data.threshold,
    mirip: (data.mirip || []).map((x) => ({
      motif: gabungMotif(x.motif),
      skor: x.skor,
      label: `${Math.round(x.skor * 100)}% mirip`,
    })),
  };
}

function cariSimulasi({ file, contohId }) {
  let utama = KATALOG[0];
  let skor = 0.94;

  if (contohId) {
    utama = KATALOG.find((m) => m.id === contohId) || KATALOG[0];
    skor = 0.96;
  } else if (file) {
    const namaFile = (file.name || "").toLowerCase();
    const cocokNama = KATALOG.find(
      (m) =>
        namaFile.includes(m.id.replace("-", "")) ||
        namaFile.includes(m.id) ||
        namaFile.includes(m.nama.toLowerCase().replace("batik ", ""))
    );

    if (cocokNama) {
      utama = cocokNama;
      skor = 0.95;
    } else {
      const hash = Array.from(namaFile).reduce((acc, ch) => acc + ch.charCodeAt(0), file.size || 7);
      utama = KATALOG[hash % KATALOG.length];
      skor = 0.86 + ((hash % 9) / 100);
    }
  }

  const mirip = KATALOG.filter((m) => m.id !== utama.id)
    .map((m) => ({ motif: m, nilai: hitungSkorMirip(utama, m) }))
    .sort((a, b) => b.nilai - a.nilai)
    .slice(0, 3)
    .map(({ motif, nilai }) => ({ motif, label: `${nilai}% mirip` }));

  return { sumber: "simulasi", tebakan: utama, skor, yakin: skor >= 0.8, mirip };
}

/**
 * Cari motif dari foto.
 * - Ada file + backend menyala  -> hasil asli dari POST /predict (sumber: "backend")
 * - Backend mati / contoh katalog -> hasil simulasi lokal (sumber: "simulasi")
 * - Backend menolak foto          -> melempar GagalPencarian dengan pesan dari server
 */
export async function cariMotif({ file, contohId }) {
  if (file) {
    const hasil = await cariDiBackend(file);
    if (hasil) return hasil;
  }
  await new Promise((r) => setTimeout(r, 420));
  return cariSimulasi({ file, contohId });
}

/** Kirim penilaian "akurat / kurang tepat" ke backend. Diam saja kalau gagal. */
export async function kirimUmpanBalik(queryId, cocok) {
  if (!queryId) return;
  try {
    await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ query_id: queryId, cocok }),
    });
  } catch {
    // umpan balik tetap tersimpan di localStorage
  }
}
