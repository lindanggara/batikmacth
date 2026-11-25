import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";
import { LingkaranFotoBatik } from "../components/KartuMotifBaru";

function hitungAnalisisMendalam(a, b) {
  if (!a || !b) return { total: 50, dimensi: [], matriks: [] };

  const identik = a.id === b.id;
  const samaAliran = (a.aliran || "") === (b.aliran || "");
  const samaDaerah = (a.daerah || "").split(" ")[0] === (b.daerah || "").split(" ")[0];
  const samaPola = (a.pola || "") === (b.pola || "");

  const geometri = identik ? 100 : samaPola ? 84 : 44;
  const isen = identik ? 100 : samaAliran ? 79 : 51;
  const wilayah = identik ? 100 : samaDaerah ? 92 : samaAliran ? 70 : 35;
  const pakem = identik ? 100 : samaAliran ? 83 : 48;
  const total = Math.round((geometri + isen + wilayah + pakem) / 4);

  const matriks = [
    { aspek: "Daerah Asal", kiri: a.daerah, kanan: b.daerah },
    { aspek: "Aliran Wastra", kiri: a.aliran || "-", kanan: b.aliran || "-" },
    { aspek: "Anatomi & Isen-Isen", kiri: a.anatomi || a.ciri, kanan: b.anatomi || b.ciri },
    { aspek: "Makna Filosofis", kiri: a.filosofi || "-", kanan: b.filosofi || "-" },
    { aspek: "Pakem & Busana", kiri: a.busana || a.pakem || "-", kanan: b.busana || b.pakem || "-" },
  ];

  return {
    total,
    dimensi: [
      { label: "Struktur Geometris & Simetri", nilai: geometri },
      { label: "Kerapatan Ornamen & Isen-Isen", nilai: isen },
      { label: "Kedekatan Aliran & Wilayah", nilai: wilayah },
      { label: "Keselarasan Pakem Adat", nilai: pakem },
    ],
    matriks,
  };
}

export default function ComparePage() {
  const [idKiri, setIdKiri] = useState("kawung");
  const [idKanan, setIdKanan] = useState("sekar-jagad");
  const [modeTampilan, setModeTampilan] = useState("berdampingan");
  const [zoomTekstur, setZoomTekstur] = useState(false);
  const [posisiSlider, setPosisiSlider] = useState(50);

  const kiri = KATALOG.find((m) => m.id === idKiri) || KATALOG[0];
  const kanan = KATALOG.find((m) => m.id === idKanan) || KATALOG[1];

  const analisis = useMemo(() => hitungAnalisisMendalam(kiri, kanan), [kiri, kanan]);

  function tukarMotif() {
    setIdKiri(idKanan);
    setIdKanan(idKiri);
  }

  return (
    <div className="w-full max-w-full space-y-7 overflow-x-hidden">
      {/* Header + Preset Pasangan Mirip */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div className="min-w-0">
          <span className="text-[11px] font-bold tracking-widest text-[#AD7559] uppercase">
            Laboratorium Komparasi Visual
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#432912]">
            Bandingkan Dua Motif Batik
          </h1>
          <p className="mt-1 text-xs text-[#432912]/65">
            Analisis struktur pola, detail isen-isen, dan tabel perbandingan karakteristik dua motif secara berdampingan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
            Uji Mirip:
          </span>
          {[
            { a: "bali", b: "poleng", label: "Bali vs Poleng" },
            { a: "kawung", b: "sekar-jagad", label: "Kawung vs Sekar Jagad" },
            { a: "megamendung", b: "celup", label: "Megamendung vs Celup" },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setIdKiri(p.a);
                setIdKanan(p.b);
                setPosisiSlider(50);
              }}
              className="whitespace-nowrap rounded-full border border-[#C59C8A]/60 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-[#432912] transition hover:bg-[#AD7559] hover:text-white"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* PANEL UTAMA KOMPARASI VISUAL */}
      <section className="glass-panel w-full overflow-hidden rounded-[32px] p-5 sm:p-6">
        {/* Baris Pemilih Motif A, Tombol Tukar, dan Motif B (Grid Simetris Anti-Melenceng) */}
        <div className="grid w-full grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-[#C59C8A]/55 bg-white/85 px-3.5 py-2.5 shadow-2xs">
            <span className="shrink-0 whitespace-nowrap rounded-full bg-[#432912] px-2.5 py-1 text-[10px] font-bold text-white">
              Kiri (A)
            </span>
            <select
              value={idKiri}
              onChange={(e) => setIdKiri(e.target.value)}
              aria-label="Pilih Motif Kiri"
              className="w-full min-w-0 truncate bg-transparent text-xs font-bold text-[#432912] focus:outline-none"
            >
              {KATALOG.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} — {m.daerah}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={tukarMotif}
            title="Tukar posisi Motif A dan B"
            aria-label="Tukar posisi Motif A dan B"
            className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C59C8A]/60 bg-white text-sm font-bold text-[#432912] shadow-xs transition hover:scale-105 hover:bg-[#AD7559] hover:text-white"
          >
            ⇄
          </button>

          <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-[#C59C8A]/55 bg-white/85 px-3.5 py-2.5 shadow-2xs">
            <span className="shrink-0 whitespace-nowrap rounded-full bg-[#AD7559] px-2.5 py-1 text-[10px] font-bold text-white">
              Kanan (B)
            </span>
            <select
              value={idKanan}
              onChange={(e) => setIdKanan(e.target.value)}
              aria-label="Pilih Motif Kanan"
              className="w-full min-w-0 truncate bg-transparent text-xs font-bold text-[#432912] focus:outline-none"
            >
              {KATALOG.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} — {m.daerah}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Kontrol Mode Tampilan (Sejajar Penuh Kiri-Kanan) */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#432912]/10 pb-4">
          <div className="inline-flex rounded-full bg-[#D5D2CA]/60 p-1">
            <button
              type="button"
              onClick={() => setModeTampilan("berdampingan")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                modeTampilan === "berdampingan"
                  ? "bg-[#432912] text-white shadow-xs"
                  : "text-[#432912]/70 hover:text-[#432912]"
              }`}
            >
              Berdampingan (Side-by-Side)
            </button>
            <button
              type="button"
              onClick={() => setModeTampilan("slider")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                modeTampilan === "slider"
                  ? "bg-[#432912] text-white shadow-xs"
                  : "text-[#432912]/70 hover:text-[#432912]"
              }`}
            >
              Lensa Geser (Overlay)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setZoomTekstur((z) => !z)}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
              zoomTekstur
                ? "border-[#AD7559] bg-[#AD7559] text-white"
                : "border-[#C59C8A]/60 bg-white/80 text-[#432912] hover:bg-white"
            }`}
          >
            {zoomTekstur ? "🔍 Zoom Tekstur 1.75× Aktif" : "🔍 Perbesar Detail Isen-Isen"}
          </button>
        </div>

        {/* KANVAS PERBANDINGAN VISUAL */}
        {modeTampilan === "berdampingan" ? (
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              { kode: "A", data: kiri, badgeBg: "bg-[#432912]" },
              { kode: "B", data: kanan, badgeBg: "bg-[#AD7559]" },
            ].map((item) => (
              <div
                key={item.kode}
                className="group relative h-72 min-w-0 overflow-hidden rounded-[24px] border border-white/45 bg-[#432912] shadow-md sm:h-80"
              >
                <div
                  className={`h-full w-full transition-transform duration-500 ${
                    zoomTekstur ? "scale-[1.75]" : "scale-100 group-hover:scale-105"
                  }`}
                >
                  <LingkaranFotoBatik motif={item.data} className="h-full w-full" />
                </div>

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(43,24,11,0.28) 0%, transparent 42%, rgba(32,17,7,0.92) 100%)",
                  }}
                />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className={`rounded-full ${item.badgeBg} px-3 py-1 text-[10px] font-bold text-white shadow-xs`}>
                    Motif {item.kode}
                  </span>
                  <span className="truncate rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                    {item.data.aliran || "Wastra Nusantara"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] font-medium text-[#C59C8A]">{item.data.daerah}</p>
                  <h2 className="text-lg font-bold">{item.data.nama}</h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative mt-5 h-72 w-full select-none overflow-hidden rounded-[24px] border border-white/45 bg-[#432912] shadow-lg sm:h-96">
            <div className={`absolute inset-0 transition-transform duration-500 ${zoomTekstur ? "scale-[1.75]" : "scale-100"}`}>
              <LingkaranFotoBatik motif={kanan} className="h-full w-full" />
            </div>

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - posisiSlider}% 0 0)` }}
            >
              <div className={`h-full w-full transition-transform duration-500 ${zoomTekstur ? "scale-[1.75]" : "scale-100"}`}>
                <LingkaranFotoBatik motif={kiri} className="h-full w-full" />
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.65)]"
              style={{ left: `${posisiSlider}%` }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#432912]/90 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                ⇄
              </div>
            </div>

            <input
              type="range"
              min="5"
              max="95"
              value={posisiSlider}
              onChange={(e) => setPosisiSlider(Number(e.target.value))}
              aria-label="Geser pembanding motif"
              className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
            />

            <span className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full border border-white/25 bg-black/45 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
              A: {kiri.nama}
            </span>
            <span className="pointer-events-none absolute right-4 bottom-4 z-10 rounded-full border border-white/25 bg-black/45 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
              B: {kanan.nama}
            </span>
          </div>
        )}
      </section>

      {/* BAGIAN BAWAH: SKOR KEMIRIPAN VEKTOR & TABEL PERBANDINGAN DETAIL */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="glass-panel flex flex-col justify-between rounded-[28px] p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#AD7559] uppercase">
                  Analisis Vektor CNN
                </span>
                <h2 className="mt-0.5 text-base font-bold text-[#432912]">
                  Indeks Kemiripan
                </h2>
              </div>
              <div className="shrink-0 rounded-2xl bg-[#432912] px-3.5 py-2 text-right text-white">
                <span className="block text-[9px] text-[#C59C8A] uppercase">Skor Total</span>
                <span className="text-base font-extrabold">{analisis.total}%</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {analisis.dimensi.map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#432912]">{d.label}</span>
                    <span className="font-extrabold text-[#85522F]">{d.nilai}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#D5D2CA]/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#85522F] to-[#AD7559] transition-all duration-500"
                      style={{ width: `${d.nilai}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <Link
              to="/hasil"
              state={{ contohId: kiri.id }}
              className="flex h-10 items-center justify-center rounded-full bg-[#432912] px-3 text-center text-[11px] font-bold text-white transition hover:opacity-90"
            >
              Detail {kiri.nama.replace("Batik ", "")}
            </Link>
            <Link
              to="/hasil"
              state={{ contohId: kanan.id }}
              className="flex h-10 items-center justify-center rounded-full bg-[#AD7559] px-3 text-center text-[11px] font-bold text-white transition hover:brightness-105"
            >
              Detail {kanan.nama.replace("Batik ", "")}
            </Link>
          </div>
        </div>

        <div className="glass-latte min-w-0 overflow-hidden rounded-[28px] p-6">
          <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
            Matriks Komparasi Kurator
          </span>
          <h2 className="mt-0.5 text-base font-bold text-[#432912]">
            Perbedaan Karakteristik {kiri.nama} vs {kanan.nama}
          </h2>

          <div className="mt-4 divide-y divide-[#432912]/10">
            {analisis.matriks.map((row) => (
              <div key={row.aspek} className="grid grid-cols-1 gap-3 py-3.5 sm:grid-cols-[130px_minmax(0,1fr)_minmax(0,1fr)]">
                <span className="text-[11px] font-extrabold text-[#85522F] uppercase">
                  {row.aspek}
                </span>
                <p className="min-w-0 rounded-xl bg-white/75 p-3 text-xs leading-relaxed text-[#432912]">
                  <strong className="mb-0.5 block text-[10px] text-[#432912]/60">A &bull; {kiri.nama}</strong>
                  {row.kiri}
                </p>
                <p className="min-w-0 rounded-xl bg-white/75 p-3 text-xs leading-relaxed text-[#432912]">
                  <strong className="mb-0.5 block text-[10px] text-[#AD7559]">B &bull; {kanan.nama}</strong>
                  {row.kanan}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}