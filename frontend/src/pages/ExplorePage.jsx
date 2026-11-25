import { useMemo, useState } from "react";
import { KATALOG, unduhDatasetCSV, unduhDatasetJSON } from "../data/katalogMotif";
import KartuMotifBaru from "../components/KartuMotifBaru";
import useFavoritLokal from "../hooks/useFavoritLokal";

const FILTER_ALIRAN = ["Semua", "Pedalaman Keraton", "Pesisir", "Nusantara"];

export default function ExplorePage() {
  const fav = useFavoritLokal();
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState("Semua");

  const hasilFilter = useMemo(() => {
    return KATALOG.filter((m) => {
      const cocokTeks =
        m.nama.toLowerCase().includes(cari.toLowerCase()) ||
        m.daerah.toLowerCase().includes(cari.toLowerCase()) ||
        m.ciri.toLowerCase().includes(cari.toLowerCase());
      if (!cocokTeks) return false;
      if (filter === "Semua") return true;
      if (filter === "Pedalaman Keraton") return /pedalaman/i.test(m.aliran || "");
      if (filter === "Pesisir") return /pesisir/i.test(m.aliran || "");
      return !/pedalaman|pesisir/i.test(m.aliran || "");
    });
  }, [cari, filter]);

  return (
    <div className="space-y-7">
      {/* Header Katalog + Unduh Dataset */}
      <div className="glass-panel flex flex-col justify-between gap-5 rounded-[32px] p-6 sm:p-8 lg:flex-row lg:items-center">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#AD7559] uppercase">
            Dataset Referensi &bull; {KATALOG.length} Kelas Motif
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#432912]">
            Katalog Motif Batik Indonesia
          </h1>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#432912]/70">
            Seluruh 15 kelas motif batik Nusantara mengacu pada dataset Indonesian Batik Motifs (Corak App).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => unduhDatasetCSV()}
            className="rounded-full bg-[#AD7559] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:brightness-105"
          >
            ⬇ Unduh Metadata (.CSV)
          </button>
          <button
            type="button"
            onClick={() => unduhDatasetJSON()}
            className="rounded-full border border-[#C59C8A]/60 bg-white/80 px-4 py-2.5 text-xs font-bold text-[#432912] transition hover:bg-white"
          >
            ⬇ Dataset (.JSON)
          </button>
          <a
            href="https://www.kaggle.com/datasets/alfanme/indonesian-batik-motifs-corak-app"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#432912]/20 bg-[#432912] px-4 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
          >
            Sumber Kaggle ↗
          </a>
        </div>
      </div>

      {/* Pencarian & Filter Aliran */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari nama motif, daerah asal, atau ciri ornamen..."
          className="glass-panel w-full rounded-full px-5 py-2.5 text-xs font-medium text-[#432912] placeholder-[#432912]/45 focus:outline-none sm:max-w-sm"
        />

        <div className="flex flex-wrap gap-1.5">
          {FILTER_ALIRAN.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === f
                  ? "bg-[#AD7559] text-white shadow-sm"
                  : "bg-white/65 text-[#432912]/70 hover:bg-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid 15 Motif */}
      {hasilFilter.length === 0 ? (
        <div className="glass-panel rounded-[28px] p-10 text-center">
          <p className="text-sm font-bold text-[#432912]">Motif tidak ditemukan</p>
          <button
            type="button"
            onClick={() => { setCari(""); setFilter("Semua"); }}
            className="mt-3 rounded-full bg-[#AD7559] px-5 py-2 text-xs font-bold text-white"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hasilFilter.map((m) => (
            <KartuMotifBaru
              key={m.id}
              motif={m}
              favorit={fav.ada(m.id)}
              onToggle={fav.toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}