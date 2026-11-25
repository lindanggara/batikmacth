import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HATI = "M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z";

export function LingkaranFotoBatik({ motif, srcManual, className = "" }) {
  const [gagal, setGagal] = useState(false);
  const sumber = srcManual || motif?.gambar || (motif?.id ? `/motif/${motif.id}.jpg` : null);

  return (
    <div className={`relative overflow-hidden bg-[#432912] ${className}`}>
      {!gagal && sumber ? (
        <img
          src={sumber}
          alt={motif ? `Kain batik motif ${motif.nama}` : "Foto kain batik"}
          onError={() => setGagal(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className={`h-full w-full ${motif?.pola || "pola-kawung"}`} role="img" aria-label={motif?.nama || "Motif batik"} />
      )}
    </div>
  );
}

export default function KartuMotifBaru({ motif, favorit, onToggle, label }) {
  const nav = useNavigate();
  const [gagal, setGagal] = useState(false);
  const sumber = motif?.gambar || (motif?.id ? `/motif/${motif.id}.jpg` : null);
  const isPesisir = /cirebon|pekalongan|madura|lasem|banten/i.test(motif?.daerah || "");

  return (
    <article
      onClick={() => nav("/hasil", { state: { contohId: motif.id } })}
      className="card-motion motion-sway motion-reveal group relative flex min-h-[350px] cursor-pointer select-none flex-col justify-between overflow-hidden rounded-[28px] border border-white/35 bg-[#432912] text-white shadow-[0_18px_36px_rgba(67,41,18,0.2)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_46px_rgba(67,41,18,0.3)]"
    >
      {/* Foto Full-Bleed */}
      {!gagal && sumber ? (
        <img
          src={sumber}
          alt={`Batik motif ${motif.nama}`}
          onError={() => setGagal(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-110 ${motif?.pola || "pola-kawung"}`} />
      )}

      {/* Gradasi Glassmorphism Gelap di Bawah agar Teks Tajam */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(43,24,11,0.35) 0%, rgba(43,24,11,0.08) 32%, rgba(43,24,11,0.86) 58%, rgba(32,17,7,0.98) 100%)",
        }}
      />

      {/* Baris Atas: Pill Status Satu Baris + Tombol Favorit */}
      <div className="relative z-10 flex items-center justify-between gap-2 p-4 pb-0">
        <span className="truncate rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] font-semibold tracking-wide whitespace-nowrap text-white backdrop-blur-md">
          {label || (isPesisir ? "Pesisir" : "Klasik Keraton")}
        </span>

        {onToggle && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle(motif.id); }}
            aria-pressed={favorit}
            aria-label={favorit ? `Hapus ${motif.nama} dari favorit` : `Simpan ${motif.nama} ke favorit`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black/55"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinejoin="round"
              fill={favorit ? "#C59C8A" : "none"} stroke={favorit ? "#C59C8A" : "currentColor"}>
              <path d={HATI} />
            </svg>
          </button>
        )}
      </div>

      {/* Bagian Bawah: Judul, Daerah, Deskripsi, Tag & Tombol Putih Utuh */}
      <div className="glass-photo-sheet relative z-10 mt-20 flex flex-col rounded-t-[24px] p-4">
        <span className="w-fit rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#C59C8A] backdrop-blur-sm">
          {motif.daerah}
        </span>

        <h3 className="mt-1.5 break-words text-lg font-bold leading-snug tracking-tight text-white">
          {motif.nama}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-[#D5D2CA]/90">
          {motif.ciri || `Motif batik tradisional khas ${motif.daerah} dengan detail ornamen klasik Nusantara.`}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            {motif?.aliran || (isPesisir ? "Corak Pesisir" : "Corak Pedalaman")}
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-[#C59C8A] backdrop-blur-md">
            Wastra Asli
          </span>
        </div>

        {/* Tombol Pil Putih Utuh di Bawah */}
        <div className="mt-4">
          <span className="flex h-10 w-full items-center justify-center rounded-full bg-white text-xs font-bold text-[#432912] shadow-md transition-transform duration-200 group-hover:scale-[1.02]">
            Lihat Detail Motif
          </span>
        </div>
      </div>
    </article>
  );
}