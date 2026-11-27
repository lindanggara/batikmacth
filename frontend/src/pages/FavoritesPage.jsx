import { Link } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";
import KartuMotifBaru from "../components/KartuMotifBaru";
import useFavoritLokal from "../hooks/useFavoritLokal";
import { useToast } from "../context/ToastContext";

export default function FavoritesPage() {
  const fav = useFavoritLokal();
  const { tampilkanToast } = useToast();
  const koleksi = KATALOG.filter((m) => fav.ada(m.id));
  const rekomendasiKurator = KATALOG.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#AD7559] uppercase">
            Kurasi Pribadi &bull; {koleksi.length} Tersimpan
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#432912]">
            Koleksi Motif Favorit
          </h1>
          <p className="mt-1 text-xs text-[#432912]/65">
            Daftar ragam batik yang kamu tandai untuk dipelajari atau dibandingkan kembali.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {koleksi.length >= 2 && (
            <Link
              to="/bandingkan"
              className="rounded-full border border-[#C59C8A]/70 bg-white/80 px-4 py-2 text-xs font-bold text-[#432912] transition hover:bg-white"
            >
              Bandingkan Koleksi ({koleksi.length})
            </Link>
          )}
          <Link
            to="/jelajah"
            className="rounded-full bg-[#AD7559] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:brightness-105"
          >
            + Jelajahi Katalog
          </Link>
        </div>
      </div>

      {koleksi.length === 0 ? (
        <div className="space-y-8">
          {/* Banner Empty State dengan Background Batik Vector */}
          <div className="group relative overflow-hidden rounded-[32px] border border-[#C59C8A]/50 bg-[#2E190B] p-8 text-white shadow-[0_20px_50px_rgba(67,41,18,0.2)] sm:p-10">
            {/* Pola Batik Vector (Kawung & Lingkaran Ornamen) */}
            <div
              className="pointer-events-none absolute inset-0 opacity-35 transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23E5BFA9' stroke-width='1.4'%3E%3Cellipse cx='60' cy='32' rx='14' ry='24'/%3E%3Cellipse cx='60' cy='88' rx='14' ry='24'/%3E%3Cellipse cx='32' cy='60' rx='24' ry='14'/%3E%3Cellipse cx='88' cy='60' rx='24' ry='14'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Ccircle cx='60' cy='60' r='2.5' fill='%23E5BFA9'/%3E%3Ccircle cx='0' cy='0' r='16' stroke-dasharray='3 3'/%3E%3Ccircle cx='120' cy='0' r='16' stroke-dasharray='3 3'/%3E%3Ccircle cx='0' cy='120' r='16' stroke-dasharray='3 3'/%3E%3Ccircle cx='120' cy='120' r='16' stroke-dasharray='3 3'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "120px 120px",
              }}
            />

            {/* Overlay Gradien Sogan agar Teks & Tombol Tajam */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(36,19,8,0.90) 0%, rgba(58,32,14,0.78) 55%, rgba(92,53,28,0.68) 100%)",
              }}
            />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <div className="animate-float-card flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/25 bg-white/15 text-2xl text-[#F4D5B8] shadow-md backdrop-blur-md">
                  &#9825;
                </div>
                <div>
                  <span className="inline-block rounded-full border border-[#E5BFA9]/35 bg-white/10 px-3 py-0.5 text-[10px] font-bold tracking-wider text-[#F4D5B8] uppercase backdrop-blur-xs">
                    Galeri Kurasi Pribadi
                  </span>
                  <h2 className="mt-1.5 text-lg font-extrabold text-white">
                    Belum Ada Motif di Koleksi Favoritmu
                  </h2>
                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#F5EBE1]/85">
                    Simpan motif kesukaanmu untuk membandingkan filosofi, asal daerah, dan struktur polanya kapan saja. Kamu bisa mulai langsung dari rekomendasi kurator di bawah ini.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-center gap-2.5">
                <Link
                  to="/studio"
                  className="rounded-full border border-white/25 bg-white/15 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/25"
                >
                  Pindai Kain Batik
                </Link>
                <Link
                  to="/jelajah"
                  className="rounded-full bg-[#E5BFA9] px-6 py-2.5 text-xs font-extrabold text-[#2D1A0B] shadow-md transition hover:bg-white"
                >
                  Buka 15 Katalog Motif &rarr;
                </Link>
              </div>
            </div>
          </div>
          {/* Bagian Rekomendasi Kurator agar Halaman Langsung Interaktif */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
                  Simpan Cepat &bull; Klik Ikon Hati
                </span>
                <h3 className="text-base font-bold text-[#432912]">
                  Rekomendasi Motif Pilihan Kurator
                </h3>
              </div>
              <Link
                to="/jelajah"
                className="text-xs font-bold text-[#85522F] hover:underline"
              >
                Lihat seluruh 15 motif &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {rekomendasiKurator.map((m) => (
                <KartuMotifBaru
                  key={m.id}
                  motif={m}
                  favorit={fav.ada(m.id)}
                  onToggle={(id) => {
                    fav.toggle(id);
                    tampilkanToast(`${m.nama} ditambahkan ke favorit`);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {koleksi.map((m) => (
            <KartuMotifBaru
              key={m.id}
              motif={m}
              favorit={true}
              onToggle={(id) => {
                fav.toggle(id);
                tampilkanToast(`${m.nama} dihapus dari favorit`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}