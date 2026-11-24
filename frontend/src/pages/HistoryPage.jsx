import { useState } from "react";
import { Link } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";

const KUNCI_RIWAYAT = "batiklens_riwayat_v1";

export function simpanKeRiwayat(motif, skor = 94, sumber = "Sampel Katalog") {
  if (!motif?.id) return;
  try {
    const lama = JSON.parse(localStorage.getItem(KUNCI_RIWAYAT) || "[]");
    const entriBaru = {
      uid: `${motif.id}-${Date.now()}`,
      id: motif.id,
      nama: motif.nama,
      daerah: motif.daerah,
      skor,
      sumber,
      waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
    const gabungan = [entriBaru, ...lama.filter((x) => x.id !== motif.id)].slice(0, 12);
    localStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(gabungan));
  } catch {}
}

export default function HistoryPage() {
  const [daftar, setDaftar] = useState(() => {
    try {
      const tersimpan = JSON.parse(localStorage.getItem(KUNCI_RIWAYAT) || "[]");
      if (tersimpan.length > 0) return tersimpan;
      // Contoh awal agar halaman tidak kosong saat pertama dibuka
      return KATALOG.slice(0, 3).map((m, i) => ({
        uid: `init-${m.id}`,
        id: m.id,
        nama: m.nama,
        daerah: m.daerah,
        skor: 94 - i * 4,
        sumber: "Simulasi Arsip",
        waktu: "Baru saja",
      }));
    } catch {
      return [];
    }
  });

  function hapusSemua() {
    localStorage.removeItem(KUNCI_RIWAYAT);
    setDaftar([]);
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#AD7559] uppercase">
            Log Aktivitas Klasifikasi
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#432912]">
            Riwayat Pemindaian
          </h1>
          <p className="mt-1 text-xs text-[#432912]/65">
            Daftar motif batik yang terakhir kamu identifikasi di perangkat ini.
          </p>
        </div>

        {daftar.length > 0 && (
          <button
            type="button"
            onClick={hapusSemua}
            className="rounded-full border border-[#C59C8A]/60 bg-white/75 px-4 py-2 text-xs font-bold text-[#85522F] backdrop-blur-md transition hover:bg-[#AD7559] hover:text-white"
          >
            Bersihkan Riwayat
          </button>
        )}
      </div>

      {daftar.length === 0 ? (
        <div className="glass-panel rounded-[32px] p-12 text-center">
          <p className="text-base font-bold text-[#432912]">Belum ada riwayat pemindaian</p>
          <p className="mt-1 text-xs text-[#432912]/60">
            Unggah foto batik atau pilih sampel motif di Beranda untuk mulai mencatat riwayat.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-[#AD7559] px-7 text-xs font-bold text-white shadow-sm"
          >
            Mulai Pindai Foto
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {daftar.map((item) => (
            <Link
              key={item.uid}
              to="/hasil"
              state={{ contohId: item.id }}
              className="card-motion motion-sway motion-reveal group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/35 bg-[#432912] text-white shadow-md"
            >
              <img
                src={`/motif/${item.id}.jpg`}
                alt={item.nama}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(43,24,11,0.3) 0%, rgba(43,24,11,0.15) 40%, rgba(32,17,7,0.95) 100%)",
                }}
              />

              <div className="relative z-10 flex items-center justify-between p-4">
                <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold backdrop-blur-md">
                  {item.sumber}
                </span>
                <span className="rounded-full bg-[#AD7559] px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {item.skor}% Cocok
                </span>
              </div>

              <div className="glass-photo-sheet relative z-10 mt-auto rounded-t-[22px] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">{item.nama}</h2>
                    <p className="text-[11px] text-[#C59C8A]">{item.daerah} &bull; {item.waktu}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-[#432912]">
                    &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}