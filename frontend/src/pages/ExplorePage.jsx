import { useMemo, useState } from "react";
import { KATALOG } from "../data/katalogMotif";
import KartuMotifBaru from "../components/KartuMotifBaru";
import useFavoritLokal from "../hooks/useFavoritLokal";

export default function ExplorePage() {
  const [daerah, setDaerah] = useState("Semua");
  const [q, setQ] = useState("");
  const fav = useFavoritLokal();

  const daftarDaerah = useMemo(
    () => ["Semua", ...Array.from(new Set(KATALOG.map((m) => m.daerah))).sort()],
    []
  );

  const hasil = KATALOG.filter(
    (m) =>
      (daerah === "Semua" || m.daerah === daerah) &&
      m.nama.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Katalog Motif</h1>
          <p className="mt-1 text-sm text-[#432912]/60">{KATALOG.length} koleksi motif batik Nusantara</p>
        </div>

        <div className="flex h-12 w-full max-w-xs items-center rounded-full bg-[#D5D2CA] p-1.5 pl-4">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama motif..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
          <span className="bg-karamel flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </span>
        </div>
      </div>

      <div className="-mx-5 mt-5 flex gap-2.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
        {daftarDaerah.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDaerah(d)}
            className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold transition ${
              daerah === d
                ? "bg-karamel text-white shadow-sm"
                : "bg-[#D5D2CA] text-[#432912]/75 hover:bg-[#C59C8A]"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {hasil.map((m) => (
          <KartuMotifBaru key={m.id} motif={m} favorit={fav.ada(m.id)} onToggle={fav.toggle} />
        ))}
      </div>
    </div>
  );
}