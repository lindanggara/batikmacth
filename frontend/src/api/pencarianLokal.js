import { KATALOG } from "../data/katalogMotif";

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// SEMENTARA: hasil tiruan supaya tampilan bisa didemokan tanpa backend.
// Saat API siap, ganti isi fungsi ini dengan fetch ke POST /search dan kembalikan bentuk data yang sama.
export async function cariMotif({ file, contohId }) {
  await new Promise((r) => setTimeout(r, 700));
  const h = hash(`${file?.name ?? ""}${file?.size ?? 0}`);
  const idx = contohId ? Math.max(0, KATALOG.findIndex((m) => m.id === contohId)) : h % KATALOG.length;
  const tebakan = KATALOG[idx];
  const lain = KATALOG.filter((m) => m.id !== tebakan.id);
  const mirip = Array.from({ length: 3 }, (_, i) => ({
    motif: lain[(idx + i) % lain.length],
    label: i === 0 ? "Sangat mirip" : "Cukup mirip",
  }));
  return { tebakan, yakin: contohId ? true : h % 5 !== 0, mirip };
}