import { useState } from "react";
import { Link } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";

export default function ComparePage() {
  const [idKiri, setIdKiri] = useState(KATALOG[0]?.id || "parang");
  const [idKanan, setIdKanan] = useState(KATALOG[1]?.id || "kawung");

  const kiri = KATALOG.find((m) => m.id === idKiri) || KATALOG[0];
  const kanan = KATALOG.find((m) => m.id === idKanan) || KATALOG[1];

  const samaDaerah = kiri?.daerah === kanan?.daerah;
  const estimasiMirip = kiri?.id === kanan?.id ? 100 : samaDaerah ? 74 : 48;

  return (
    <div className="space-y-7">
      {/* Header Halaman */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#AD7559] uppercase">
            Komparasi Visual &amp; Fitur
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#432912]">
            Bandingkan Dua Motif Batik
          </h1>
          <p className="mt-1 text-xs text-[#432912]/65">
            Pilih dua motif untuk melihat perbedaan struktur pola, asal wilayah, dan estimasi kemiripan fiturnya.
          </p>
        </div>

        <div className="glass-latte inline-flex items-center gap-3 rounded-2xl px-4 py-2.5">
          <span className="text-[11px] font-bold text-[#85522F]">Kemiripan Struktural:</span>
          <span className="rounded-full bg-[#AD7559] px-3 py-0.5 text-xs font-bold text-white">
            {estimasiMirip}%
          </span>
        </div>
      </div>

      {/* Pemilih 2 Motif */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          { label: "Motif Pembanding A", nilai: idKiri, ubah: setIdKiri, data: kiri },
          { label: "Motif Pembanding B", nilai: idKanan, ubah: setIdKanan, data: kanan },
        ].map((slot) => {
          const isPesisir = /cirebon|pekalongan|madura|lasem|banten/i.test(slot.data?.daerah || "");
          return (
            <div key={slot.label} className="card-motion motion-reveal glass-panel flex flex-col justify-between rounded-[32px] p-5 sm:p-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
                    {slot.label}
                  </span>
                  <select
                    value={slot.nilai}
                    onChange={(e) => slot.ubah(e.target.value)}
                    className="rounded-full border border-[#C59C8A]/60 bg-white/85 px-4 py-1.5 text-xs font-bold text-[#432912] focus:outline-none"
                  >
                    {KATALOG.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama} ({m.daerah})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Foto Full-Bleed */}
                <div className="relative mt-4 h-64 overflow-hidden rounded-[24px] shadow-md">
                  <img
                    src={slot.data?.gambar || `/motif/${slot.data?.id}.jpg`}
                    alt={slot.data?.nama}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(43,24,11,0.1) 0%, rgba(43,24,11,0.85) 100%)",
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md">
                        {slot.data?.daerah}
                      </span>
                      <h2 className="mt-1 text-xl font-bold">{slot.data?.nama}</h2>
                    </div>
                    <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold text-[#C59C8A] backdrop-blur-md">
                      {isPesisir ? "Corak Pesisir" : "Corak Pedalaman"}
                    </span>
                  </div>
                </div>

                {/* Detail Karakteristik */}
                <div className="mt-4 space-y-2.5">
                  <div className="glass-latte rounded-2xl p-3.5">
                    <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
                      Ciri Visual Utama
                    </span>
                    <p className="mt-1 text-xs leading-relaxed text-[#432912]/80">
                      {slot.data?.ciri}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/hasil"
                state={{ contohId: slot.data?.id }}
                className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-[#AD7559] text-xs font-bold text-white shadow-sm transition hover:brightness-105"
              >
                Buka Analisis Lengkap {slot.data?.nama}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}