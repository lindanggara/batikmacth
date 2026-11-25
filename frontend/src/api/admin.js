import { API_BASE, getAuthHeaders } from "./client";

/** Dilempar saat token admin tidak valid / habis (HTTP 401). Halaman harus logout dan kembali ke login. */
export class SesiHabis extends Error {}

/** Dilempar saat backend tidak bisa dihubungi sama sekali. */
export class BackendMati extends Error {}

async function panggil(path, { method = "GET", json, form } = {}) {
  const headers = { ...getAuthHeaders() };
  let body;
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form) {
    body = form;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { method, headers, body });
  } catch {
    throw new BackendMati("Server backend tidak aktif. Jalankan backend terlebih dahulu.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (res.status === 401) {
    throw new SesiHabis(data?.detail || "Sesi admin habis. Silakan masuk lagi.");
  }
  if (!res.ok) {
    const pesan = typeof data?.detail === "string" ? data.detail : `Permintaan gagal (${res.status}).`;
    throw new Error(pesan);
  }
  return data;
}

// --- autentikasi --------------------------------------------------------------
export async function loginAdmin(username, password) {
  try {
    return await panggil("/admin/login", { method: "POST", json: { username, password } });
  } catch (err) {
    // 401 di sini artinya password salah, bukan sesi habis
    if (err instanceof SesiHabis) throw new Error(err.message);
    throw err;
  }
}

// --- statistik & motif -----------------------------------------------------------
export const ambilStatistik = () => panggil("/admin/stats");
export const ambilKoleksi = () => panggil("/admin/motifs");
export const tambahMotif = ({ nama, daerah, ciri }) =>
  panggil("/admin/motifs", { method: "POST", json: { nama, daerah, ciri } });
export const hapusMotif = (id) => panggil(`/admin/motifs/${encodeURIComponent(id)}`, { method: "DELETE" });

/** Tambah foto ke galeri motif. Motif langsung bisa dicari tanpa melatih ulang model. */
export function tambahFotoMotif(id, file) {
  const form = new FormData();
  form.append("file", file);
  return panggil(`/admin/motifs/${encodeURIComponent(id)}/images`, { method: "POST", form });
}

// --- umpan balik --------------------------------------------------------------
export const ambilUmpanBalik = () => panggil("/admin/feedback");
export const tandaiUmpanBalikSelesai = (queryId) =>
  panggil(`/admin/feedback/${encodeURIComponent(queryId)}/selesai`, { method: "POST" });
