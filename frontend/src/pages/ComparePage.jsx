import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KATALOG as KATALOG_MOTIF } from "../data/katalogMotif";

const CONTOH_POPULER = [
  { label: "Bali vs Poleng", a: "bali", b: "poleng" },
  { label: "Kawung vs Sekar Jagad", a: "kawung", b: "sekar-jagad" },
  { label: "Megamendung vs Celup", a: "megamendung", b: "celup" },
];

const ambilTeks = (m, keys) => {
  for (const k of keys) {
    if (Array.isArray(m?.[k]) && m[k].length) return m[k].join(", ");
    if (typeof m?.[k] === "string" && m[k].trim()) return m[k].trim();
  }
  return "—";
};

const cekAtribut = (motif, tipe) => {
  const gabungan = [
    motif?.aliran,
    motif?.ringkasan,
    motif?.deskripsi,
    motif?.filosofi,
    motif?.pakem,
    motif?.sejarah,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (tipe === "keraton") return /keraton|pedalaman|yogyakarta|solo|surakarta|mataram/.test(gabungan);
  if (tipe === "geometris") return /geometris|simetri|lingkaran|diagonal|kotak|catur|berulang|garis/.test(gabungan);
  if (tipe === "pakem") return /larangan|sakral|raja|bangsawan|upacara|adat|pakem/.test(gabungan);
  if (tipe === "alam") return /awan|bunga|flora|fauna|burung|daun|tumbuhan|laut|alam|pala|cendrawasih/.test(gabungan);
  return false;
};

function IkonStatus({ aktif, warnaAktif }) {
  if (aktif) {
    return (
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${warnaAktif} text-white shadow-xs`}>
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#D9CEC3] text-[#7A6858]">
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

export default function ComparePage() {
  const daftarMotif = useMemo(() => (Array.isArray(KATALOG_MOTIF) ? KATALOG_MOTIF : []), []);

  const [idA, setIdA] = useState("kawung");
  const [idB, setIdB] = useState("sekar-jagad");
  const [modeTampilan, setModeTampilan] = useState("berdampingan");
  const [posisiGeser, setPosisiGeser] = useState(50);
  const [perbesar, setPerbesar] = useState(false);

  const motifA = useMemo(
    () => daftarMotif.find((m) => m.id === idA) || daftarMotif[0] || {},
    [daftarMotif, idA]
  );
  const motifB = useMemo(
    () => daftarMotif.find((m) => m.id === idB) || daftarMotif[1] || daftarMotif[0] || {},
    [daftarMotif, idB]
  );

  const tukarMotif = () => {
    setIdA(idB);
    setIdB(idA);
  };

  const gbrA = motifA.gambar || `/motif/${motifA.id}.jpg`;
  const gbrB = motifB.gambar || `/motif/${motifB.id}.jpg`;

  const barisChecklist = [
    { id: "keraton", label: "Aliran Pedalaman / Keraton" },
    { id: "geometris", label: "Struktur Pola Geometris" },
    { id: "pakem", label: "Memiliki Pakem / Aturan Adat" },
    { id: "alam", label: "Unsur Flora, Fauna & Alam" },
  ];

  const barisTeks = [
    {
      aspek: "Ciri Visual Utama",
      nilaiA: ambilTeks(motifA, ["ringkasan", "deskripsi", "ciriVisual", "ciri", "karakteristik"]),
      nilaiB: ambilTeks(motifB, ["ringkasan", "deskripsi", "ciriVisual", "ciri", "karakteristik"]),
    },
    {
      aspek: "Makna & Filosofi",
      nilaiA: ambilTeks(motifA, ["filosofi", "makna"]),
      nilaiB: ambilTeks(motifB, ["filosofi", "makna"]),
    },
    {
      aspek: "Sejarah Singkat",
      nilaiA: ambilTeks(motifA, ["sejarah"]),
      nilaiB: ambilTeks(motifB, ["sejarah"]),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* BAGIAN ATAS TETAP SEPERTI SEMULA */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold tracking-wider text-[#9A6347] uppercase">
            Eksplorasi Visual
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-[#2D1A0B] sm:text-3xl">
            Bandingkan Dua Motif Batik
          </h1>
          <p className="mt-1 text-sm text-[#6E5440]">
            Pilih dua kain batik untuk melihat perbedaan pola, asal daerah, dan filosofinya secara langsung.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#8C705A]">Coba cepat:</span>
          {CONTOH_POPULER.map((c) => {
            const aktif = idA === c.a && idB === c.b;
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  setIdA(c.a);
                  setIdB(c.b);
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  aktif
                    ? "bg-[#432912] text-white shadow-xs"
                    : "border border-[#DFD1C3] bg-white/80 text-[#432912] hover:bg-white"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kotak Pemilih Motif & Bingkai Perbandingan Gambar (Tetap Seperti Semula) */}
      <section className="overflow-hidden rounded-[28px] border border-[#E5D7CA] bg-[#FAF6F2] p-5 shadow-xs sm:p-6">
        <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#E2D4C6] bg-white px-3.5 py-2.5">
            <span className="shrink-0 rounded-full bg-[#3D2310] px-2.5 py-0.5 text-[11px] font-bold text-white">
              Kiri
            </span>
            <select
              aria-label="Pilih Motif Kiri"
              value={idA}
              onChange={(e) => setIdA(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#2D1A0B] focus:outline-none"
            >
              {daftarMotif.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} — {m.daerah}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={tukarMotif}
            title="Tukar posisi motif kiri dan kanan"
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#DFD1C3] bg-white text-[#432912] shadow-2xs transition hover:border-[#AD7559] hover:text-[#AD7559]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10h14l-4-4" />
              <path d="M17 14H3l4 4" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5 rounded-2xl border border-[#E2D4C6] bg-white px-3.5 py-2.5">
            <span className="shrink-0 rounded-full bg-[#AD7559] px-2.5 py-0.5 text-[11px] font-bold text-white">
              Kanan
            </span>
            <select
              aria-label="Pilih Motif Kanan"
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#2D1A0B] focus:outline-none"
            >
              {daftarMotif.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} — {m.daerah}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE0D5] pt-4">
          <div className="inline-flex rounded-full border border-[#E2D4C6] bg-[#F2E9E0] p-1">
            <button
              type="button"
              onClick={() => setModeTampilan("berdampingan")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                modeTampilan === "berdampingan"
                  ? "bg-[#3D2310] text-white shadow-2xs"
                  : "text-[#6E5440] hover:text-[#2D1A0B]"
              }`}
            >
              Berdampingan
            </button>
            <button
              type="button"
              onClick={() => setModeTampilan("geser")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                modeTampilan === "geser"
                  ? "bg-[#3D2310] text-white shadow-2xs"
                  : "text-[#6E5440] hover:text-[#2D1A0B]"
              }`}
            >
              Geser Lapisan
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPerbesar((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              perbesar
                ? "border-[#AD7559] bg-[#AD7559] text-white"
                : "border-[#DFD1C3] bg-white text-[#432912] hover:border-[#AD7559]"
            }`}
          >
            <svg
              className={`h-4 w-4 ${perbesar ? "text-white" : "text-[#AD7559]"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M11 8v6" />
              <path d="M8 11h6" />
            </svg>
            <span>{perbesar ? "Zoom Detail Aktif (1.6×)" : "Perbesar Detail Kain"}</span>
          </button>
        </div>

        {modeTampilan === "berdampingan" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { item: motifA, src: gbrA, sisi: "Motif Kiri", badgeColor: "bg-[#3D2310]" },
              { item: motifB, src: gbrB, sisi: "Motif Kanan", badgeColor: "bg-[#AD7559]" },
            ].map(({ item, src, sisi, badgeColor }) => (
              <div
                key={sisi}
                className="group relative h-[290px] overflow-hidden rounded-[22px] border border-[#E2D4C6] bg-[#2D1A0B]"
              >
                <img
                  src={src}
                  alt={item.nama}
                  className={`h-full w-full object-cover transition-transform duration-500 ${
                    perbesar ? "scale-150" : "scale-100"
                  }`}
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/55 to-transparent p-3.5">
                  <span className={`rounded-full ${badgeColor} px-3 py-1 text-[11px] font-bold text-white`}>
                    {sisi}
                  </span>
                  <span className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
                    {item.aliran}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-4 text-white">
                  <p className="text-xs text-white/80">{item.daerah}</p>
                  <h2 className="font-serif text-lg font-bold">{item.nama}</h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="relative h-[320px] w-full overflow-hidden rounded-[22px] border border-[#E2D4C6] bg-[#2D1A0B] select-none">
              <img
                src={gbrB}
                alt={motifB.nama}
                className={`h-full w-full object-cover transition-transform duration-300 ${
                  perbesar ? "scale-150" : "scale-100"
                }`}
              />
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${posisiGeser}%` }}
              >
                <img
                  src={gbrA}
                  alt={motifA.nama}
                  className={`h-full w-full max-w-none object-cover transition-transform duration-300 ${
                    perbesar ? "scale-150" : "scale-100"
                  }`}
                  style={{ width: "100%" }}
                />
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.6)]"
                style={{ left: `${posisiGeser}%` }}
              >
                <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-[#2D1A0B] shadow-md">
                  ⇄
                </div>
              </div>
              <span className="absolute top-3 left-3 rounded-full bg-[#3D2310]/85 px-3 py-1 text-xs font-semibold text-white">
                {motifA.nama}
              </span>
              <span className="absolute top-3 right-3 rounded-full bg-[#AD7559]/90 px-3 py-1 text-xs font-semibold text-white">
                {motifB.nama}
              </span>
            </div>
            <div className="flex items-center gap-3 px-1">
              <span className="text-xs font-semibold text-[#432912]">{motifA.nama}</span>
              <input
                type="range"
                min="5"
                max="95"
                value={posisiGeser}
                onChange={(e) => setPosisiGeser(Number(e.target.value))}
                aria-label="Geser perbandingan dua motif"
                className="h-2 flex-1 cursor-pointer accent-[#AD7559]"
              />
              <span className="text-xs font-semibold text-[#AD7559]">{motifB.nama}</span>
            </div>
          </div>
        )}
      </section>

      {/* HANYA TABEL BAWAH YANG DIUBAH KE DESAIN MATRIKS KARTU BERWARNA & DASHED */}
      <section className="glass-card-motion rounded-[28px] p-5 shadow-[0_18px_45px_rgba(67,41,18,0.07)] sm:p-7">
        <div className="mb-6 text-center">
          <h2 className="font-serif text-xl font-extrabold text-[#2D1A0B] sm:text-2xl">
            Perbedaan Karakteristik &amp; Makna
          </h2>
          <p className="mt-1 text-xs text-[#7D6450]">
            Ringkasan perbandingan visual dan filosofis antara{" "}
            <strong className="text-[#3D2310]">{motifA.nama}</strong> dan{" "}
            <strong className="text-[#AD7559]">{motifB.nama}</strong>
          </p>
        </div>

        {/* Header Kartu Berwarna dengan Bayangan Bawah (Persis Gaya Referensi) */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[210px_1fr_1fr]">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#D7B89C] to-[#C49E7E] px-4 py-3 text-center text-[#2D1A0B] shadow-[0_8px_18px_rgba(196,158,126,0.35)]">
            <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-75">
              Parameter Wastra
            </span>
            <span className="mt-0.5 font-serif text-sm font-bold">Aspek Motif</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#432912] to-[#2E1B0B] px-4 py-3 text-center text-white shadow-[0_8px_18px_rgba(67,41,18,0.24)]">
            <span className="text-[10px] font-bold tracking-widest text-white/75 uppercase">
              {motifA.daerah}
            </span>
            <span className="mt-0.5 font-serif text-sm font-bold">{motifA.nama}</span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#AD7559] to-[#8F5A40] px-4 py-3 text-center text-white shadow-[0_8px_18px_rgba(173,117,89,0.28)]">
            <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">
              {motifB.daerah}
            </span>
            <span className="mt-0.5 font-serif text-sm font-bold">{motifB.nama}</span>
          </div>
        </div>

        {/* Baris Checklist Bulat dengan Garis Pemisah Dashed */}
        <div className="mt-3 divide-y divide-dashed divide-[#DFD1C3]">
          {barisChecklist.map((baris, idx) => (
            <div
              key={baris.id}
              className={`grid grid-cols-1 items-center gap-3 py-2.5 md:grid-cols-[210px_1fr_1fr] ${
                idx % 2 === 1 ? "rounded-xl bg-[#F5EFE9]/90" : ""
              }`}
            >
              <div className="px-3 text-center text-[11px] font-bold text-[#3D2310]">{baris.label}</div>

              <div className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#432912]/[0.05] to-transparent py-1">
                <span className="text-[11px] font-bold text-[#3D2310] md:hidden">{motifA.nama}:</span>
                <IkonStatus aktif={cekAtribut(motifA, baris.id)} warnaAktif="bg-[#432912]" />
              </div>

              <div className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#AD7559]/[0.07] to-transparent py-1">
                <span className="text-[11px] font-bold text-[#AD7559] md:hidden">{motifB.nama}:</span>
                <IkonStatus aktif={cekAtribut(motifB, baris.id)} warnaAktif="bg-[#AD7559]" />
              </div>
            </div>
          ))}

          {/* Baris Detail Deskriptif dengan Pemisah Dashed */}
          {barisTeks.map((b, idx) => (
            <div
              key={b.aspek}
              className={`grid grid-cols-1 items-center gap-3 py-3 md:grid-cols-[210px_1fr_1fr] ${
                idx % 2 === 1 ? "rounded-xl bg-[#F5EFE9]/90" : ""
              }`}
            >
              <div className="px-3 text-center text-[11px] font-bold text-[#3D2310]">{b.aspek}</div>

              <div className="px-3.5 text-center text-xs leading-normal text-[#2D1A0B]">
                <span className="mb-1 block text-[11px] font-bold text-[#3D2310] md:hidden">{motifA.nama}</span>
                {b.nilaiA}
              </div>

              <div className="px-3.5 text-center text-xs leading-normal text-[#2D1A0B]">
                <span className="mb-1 block text-[11px] font-bold text-[#AD7559] md:hidden">{motifB.nama}</span>
                {b.nilaiB}
              </div>
            </div>
          ))}
        </div>

        {/* Legenda Ikon Bawah & Tautan Bedah Motif (Persis 3 Indikator Bawah Referensi) */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#E5D7CA] pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#432912] text-xs font-bold text-white shadow-xs">
              ✓
            </span>
            <p className="text-[11px] leading-snug text-[#6E5440]">
              <strong className="text-[#2D1A0B]">Ciri Utama Motif Kiri:</strong> Menandai karakter yang melekat kuat pada {motifA.nama}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#AD7559] text-xs font-bold text-white shadow-xs">
              ✓
            </span>
            <p className="text-[11px] leading-snug text-[#6E5440]">
              <strong className="text-[#2D1A0B]">Ciri Utama Motif Kanan:</strong> Menandai karakter yang melekat kuat pada {motifB.nama}.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#FAF6F2] px-3.5 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9CEC3] text-xs font-bold text-[#7A6858]">
                ✕
              </span>
              <span className="text-[11px] font-medium text-[#6E5440]">Bukan ciri dominan</span>
            </div>
            <div className="flex gap-1.5">
              <Link
                to="/hasil"
                state={{ contohId: motifA.id }}
                className="rounded-full bg-[#432912] px-2.5 py-1 text-[10px] font-bold text-white hover:opacity-90"
              >
                Bedah Kiri
              </Link>
              <Link
                to="/hasil"
                state={{ contohId: motifB.id }}
                className="rounded-full bg-[#AD7559] px-2.5 py-1 text-[10px] font-bold text-white hover:opacity-90"
              >
                Bedah Kanan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}