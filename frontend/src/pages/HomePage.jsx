import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";
import KartuMotifBaru from "../components/KartuMotifBaru";
import useFavoritLokal from "../hooks/useFavoritLokal";

const MAKS_MB = 10;

export default function HomePage() {
  const nav = useNavigate();
  const fav = useFavoritLokal();
  const kamera = useRef(null);
  const galeri = useRef(null);
  const [error, setError] = useState("");
  const [daerah, setDaerah] = useState("Semua");
  const [cari, setCari] = useState("");
  const [seret, setSeret] = useState(false);

  const daftarDaerah = useMemo(
    () => ["Semua", ...Array.from(new Set(KATALOG.map((m) => m.daerah))).slice(0, 6)],
    []
  );

  const daftarTampil = useMemo(() => {
    return KATALOG.filter(
      (m) =>
        (daerah === "Semua" || m.daerah === daerah) &&
        m.nama.toLowerCase().includes(cari.trim().toLowerCase())
    );
  }, [daerah, cari]);

  function proses(file) {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("File harus berupa foto (JPG atau PNG).");
    if (file.size > MAKS_MB * 1024 * 1024) return setError(`Ukuran foto maksimal ${MAKS_MB} MB.`);
    nav("/hasil", { state: { file } });
  }

  return (
    <div className="space-y-7">
      {/* TOP BAR DASHBOARD */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-[#85522F] uppercase">
            Studio Klasifikasi Wastra
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-[#432912]">
            Eksplorasi &amp; Pindai Batik
          </h1>
        </div>

        <div className="flex h-11 w-full items-center rounded-full bg-[#D5D2CA] p-1 pl-4 sm:w-80">
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari motif batik..."
            className="w-full bg-transparent text-xs font-medium text-[#432912] placeholder:text-[#432912]/50 focus:outline-none"
          />
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#AD7559] text-white shadow-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </span>
        </div>
      </div>

      {/* HERO BANNER 2 KOLOM DENGAN TEKSTUR FOTO BATIK ASLI */}
      <section
        onDragOver={(e) => { e.preventDefault(); setSeret(true); }}
        onDragLeave={() => setSeret(false)}
        onDrop={(e) => { e.preventDefault(); setSeret(false); proses(e.dataTransfer.files?.[0]); }}
        className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#85522F] via-[#5E371C] to-[#432912] p-6 text-white shadow-[0_14px_34px_rgba(67,41,18,0.16)] transition-all sm:p-8 ${
          seret ? "ring-4 ring-[#C59C8A]" : ""
        }`}
      >
        <img
          src="/motif/kawung.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
        />

        <div className="relative grid items-center gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-[#C59C8A]">
              ✦ Identifikasi Motif AI
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl">
              Kenali Motif Batik dari Satu Foto
            </h2>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-[#D5D2CA] sm:text-sm">
              Unggah atau potret kain batikmu untuk mengetahui nama motif, daerah asal, serta filosofi warisan budayanya secara instan.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => kamera.current?.click()}
                className="inline-flex items-center gap-2 rounded-full bg-[#AD7559] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105 active:scale-95"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <span>Ambil Kamera</span>
              </button>
              <button
                type="button"
                onClick={() => galeri.current?.click()}
                className="rounded-full border border-[#C59C8A]/50 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
              >
                Pilih dari Galeri
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => galeri.current?.click()}
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C59C8A]/60 bg-[#432912]/55 p-6 text-center backdrop-blur-sm transition hover:border-[#C59C8A] hover:bg-[#432912]/75"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#AD7559] text-white shadow-md transition-transform group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </span>
            <span className="mt-3 text-sm font-bold text-white">
              Unggah atau seret foto ke sini
            </span>
            <span className="mt-1 text-[11px] text-[#D5D2CA]/80">
              Format JPG atau PNG (Maks. {MAKS_MB} MB)
            </span>
          </button>
        </div>

        <input ref={kamera} type="file" accept="image/*" capture="environment" className="hidden"
          onChange={(e) => { proses(e.target.files?.[0]); e.target.value = ""; }} />
        <input ref={galeri} type="file" accept="image/*" className="hidden"
          onChange={(e) => { proses(e.target.files?.[0]); e.target.value = ""; }} />
      </section>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-800">
          {error}
        </p>
      )}

      {/* KATEGORI DAERAH & GRID KARTU FOTO BATIK ASLI */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#432912]">Kategori Daerah</h2>
            <p className="text-xs text-[#432912]/60">Ketuk kartu motif di bawah untuk melihat detail dan simulasi</p>
          </div>
          <Link to="/jelajah" className="text-xs font-bold text-[#AD7559] hover:underline">
            Lihat semua koleksi &rarr;
          </Link>
        </div>

        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          {daftarDaerah.map((d) => {
            const aktif = daerah === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDaerah(d)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  aktif
                    ? "bg-[#AD7559] text-white shadow-sm"
                    : "bg-[#D5D2CA] text-[#432912]/75 hover:bg-[#C59C8A]/50"
                }`}
              >
                <span>{aktif ? "✦" : "◈"}</span>
                <span>{d}</span>
              </button>
            );
          })}
        </div>

        {daftarTampil.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#432912]/55">Motif yang dicari tidak ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {daftarTampil.slice(0, 8).map((m) => (
              <KartuMotifBaru
                key={m.id}
                motif={m}
                favorit={fav.ada(m.id)}
                onToggle={fav.toggle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}