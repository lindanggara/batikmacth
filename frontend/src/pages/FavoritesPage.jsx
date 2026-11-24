import { Link } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";
import KartuMotifBaru from "../components/KartuMotifBaru";
import useFavoritLokal from "../hooks/useFavoritLokal";

export default function FavoritesPage() {
  const fav = useFavoritLokal();
  const daftar = KATALOG.filter((m) => fav.ada(m.id));

  return (
    <div>
      <h1 className="font-display text-xl font-bold">Koleksi Favorit</h1>
      <p className="mt-1 text-sm text-[#432912]/60">
        {daftar.length ? `${daftar.length} motif batik tersimpan` : "Belum ada motif yang disimpan"}
      </p>

      {daftar.length === 0 ? (
        <div className="mt-12 glass-panel rounded-[32px] p-10 text-center">
          <p className="font-display text-xl font-bold">Belum ada favorit</p>
          <p className="mt-2 text-sm text-[#432912]/65">Tekan ikon hati pada kartu motif untuk menyimpannya di sini.</p>
          <Link to="/jelajah" className="bg-karamel mt-6 inline-flex h-12 items-center rounded-full px-8 text-sm font-bold text-white shadow-sm">
            Jelajah Katalog
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {daftar.map((m) => (
            <KartuMotifBaru key={m.id} motif={m} favorit onToggle={fav.toggle} />
          ))}
        </div>
      )}
    </div>
  );
}