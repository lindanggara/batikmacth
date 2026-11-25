import { Link } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";
import KartuMotifBaru from "../components/KartuMotifBaru";
import useFavoritLokal from "../hooks/useFavoritLokal";
import { useToast } from "../context/ToastContext";

export default function FavoritesPage() {
  const fav = useFavoritLokal();
  const { tampilkanToast } = useToast();
  const koleksi = KATALOG.filter((m) => fav.ada(m.id));

  return (
    <div className="space-y-7">
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
              className="rounded-full border border-[#C59C8A]/70 bg-white/80 px-4 py-2 text-xs font-bold text-[#432912] hover:bg-white"
            >
              Bandingkan Koleksi
            </Link>
          )}
          <Link
            to="/jelajah"
            className="rounded-full bg-[#AD7559] px-4 py-2 text-xs font-bold text-white shadow-xs hover:brightness-105"
          >
            + Jelajahi Katalog
          </Link>
        </div>
      </div>

      {koleksi.length === 0 ? (
        <div className="glass-panel rounded-[32px] p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#AD7559]/15 text-xl text-[#AD7559]">
            ♡
          </div>
          <h2 className="mt-4 text-base font-bold text-[#432912]">Belum Ada Motif Favorit</h2>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#432912]/65">
            Tekan ikon hati pada kartu motif di Studio Pindai, Katalog, atau Halaman Hasil untuk menyimpannya di sini.
          </p>
          <Link
            to="/jelajah"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-[#AD7559] px-7 text-xs font-bold text-white shadow-sm"
          >
            Buka Katalog 15 Motif
          </Link>
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