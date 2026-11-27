import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";
import KartuMotifBaru from "../components/KartuMotifBaru";
import CameraCapture from "../components/CameraCapture";
import ImageCropperModal from "../components/ImageCropperModal";
import useFavoritLokal from "../hooks/useFavoritLokal";
import { useToast } from "../context/ToastContext";

export default function HomePage() {
  const nav = useNavigate();
  const fav = useFavoritLokal();
  const { tampilkanToast } = useToast();
  const inputRef = useRef(null);
  const [bukaKamera, setBukaKamera] = useState(false);
  const [fileMentah, setFileMentah] = useState(null);
  const [dragAktif, setDragAktif] = useState(false);

  function terimaFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      tampilkanToast("Format file harus berupa gambar (JPG/PNG).", "error");
      return;
    }
    setFileMentah(file);
  }

  function kirimKeHasil(fileSiap) {
    setFileMentah(null);
    nav("/hasil", { state: { file: fileSiap } });
  }

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-[#AD7559] uppercase">
            Studio Pemindaian Wastra
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#432912] sm:text-3xl">
            Kenali Motif Batik Nusantara
          </h1>
        </div>
        <Link
          to="/jelajah"
          className="glass-latte rounded-full px-4 py-2 text-xs font-bold text-[#432912] transition hover:brightness-95"
        >
          Lihat Semua {KATALOG.length} Motif &rarr;
        </Link>
      </div>

      {/* Grid Utama 2 Kolom: Dropzone Pemindai + Panel Spesifikasi & Panduan */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.28fr_1fr]">
        {/* Kolom Kiri: Area Dropzone Unggah & Kamera */}
        <section
          onDragOver={(e) => {
            e.preventDefault();
            setDragAktif(true);
          }}
          onDragLeave={() => setDragAktif(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragAktif(false);
            terimaFile(e.dataTransfer.files?.[0]);
          }}
          className={`glass-panel relative flex flex-col justify-between overflow-hidden rounded-[32px] p-6 transition-all sm:p-8 ${
            dragAktif ? "ring-4 ring-[#AD7559]" : ""
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              terimaFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />

          {/* Kotak Dashed Viewfinder Interaktif */}
          <div
            className={`relative flex flex-1 flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-6 py-9 text-center transition-colors ${
              dragAktif
                ? "border-[#AD7559] bg-[#AD7559]/10"
                : "border-[#C59C8A]/65 bg-white/45"
            }`}
          >
            {/* Siku Viewfinder Dekoratif */}
            <span className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 rounded-tl-md border-t-2 border-l-2 border-[#AD7559]/60" />
            <span className="pointer-events-none absolute top-3.5 right-3.5 h-4 w-4 rounded-tr-md border-t-2 border-r-2 border-[#AD7559]/60" />
            <span className="pointer-events-none absolute bottom-3.5 left-3.5 h-4 w-4 rounded-bl-md border-b-2 border-l-2 border-[#AD7559]/60" />
            <span className="pointer-events-none absolute bottom-3.5 right-3.5 h-4 w-4 rounded-br-md border-b-2 border-r-2 border-[#AD7559]/60" />

            <div className="animate-float-card mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#85522F] to-[#432912] text-2xl text-white shadow-md">
              &#10022;
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#432912] sm:text-xl">
              Unggah Foto Kain atau Pindai Langsung
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-[#432912]/70">
              Tarik dan lepas foto kain batik ke bingkai ini, pilih dari galeri (dilengkapi pemotong framing 1:1), atau buka kamera perangkat secara langsung.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full bg-[#AD7559] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] hover:brightness-105"
              >
                Pilih Foto dari Galeri
              </button>

              <button
                type="button"
                onClick={() => setBukaKamera(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C59C8A]/70 bg-white/90 px-6 py-3 text-xs font-bold text-[#432912] shadow-sm transition hover:scale-[1.02] hover:bg-white"
              >
                <svg
                  className="h-4 w-4 text-[#AD7559]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <span>Buka Kamera</span>
              </button>
            </div>
          </div>

          {/* Bar Info Format & Fitur di Bagian Bawah Dropzone */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] font-semibold text-[#432912]/65">
            <span>Format: JPG, PNG, WEBP</span>
            <span>Auto Framing 1:1 &bull; Privasi Terjaga</span>
          </div>
        </section>

        {/* Kolom Kanan: Kartu Pipeline AI (Sogan) + Tips Pemindaian (Sage) */}
        <div className="flex flex-col justify-between gap-5">
          {/* Kartu Sogan Gelap: Alur & Arsitektur Klasifikasi */}
          <div className="glass-card-motion glass-sogan relative overflow-hidden rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full border border-[#E5BFA9]/30 bg-white/10 px-3 py-0.5 text-[10px] font-bold tracking-wider text-[#F4D5B8] uppercase">
                Mesin Visi Komputer
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                15 Kelas Siap
              </span>
            </div>

            <h3 className="mt-3 text-base font-bold text-white">
              EfficientNet-B0 + Pencarian Kemiripan CBIR
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#F5EBE1]/80">
              Sistem mengekstraksi vektor ciri tekstur motif lalu mencocokkannya dengan basis data wastra Nusantara menggunakan <strong>Cosine Similarity</strong>.
            </p>

            {/* 3 Langkah Alur Singkat */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="text-[10px] font-extrabold text-[#E5BFA9]">01. INPUT</span>
                <p className="mt-0.5 text-[11px] font-semibold text-white">Foto / Kamera</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="text-[10px] font-extrabold text-[#E5BFA9]">02. CROP</span>
                <p className="mt-0.5 text-[11px] font-semibold text-white">Fokus Pola 1:1</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="text-[10px] font-extrabold text-[#E5BFA9]">03. BEDAH</span>
                <p className="mt-0.5 text-[11px] font-semibold text-white">Top-5 &amp; Filosofi</p>
              </div>
            </div>
          </div>

          {/* Kartu Sage Lembut: Panduan Foto Akurat */}
          <div className="glass-card-motion glass-sage rounded-[28px] p-6">
            <span className="text-[10px] font-bold tracking-widest text-[#48664C] uppercase">
              Tips Pemindaian Optimal
            </span>
            <h3 className="mt-1 text-sm font-bold text-[#2B3D2E]">
              Agar Akurasi Klasifikasi Maksimal
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-[#2B3D2E]/85">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#48664C] text-[10px] font-bold text-white">
                  1
                </span>
                <span>Arahkan kamera tegak lurus (jarak 20–30 cm) agar ornamen utama &amp; isen-isen terlihat jelas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#48664C] text-[10px] font-bold text-white">
                  2
                </span>
                <span>Gunakan pencahayaan ruang yang merata dan hindari bayangan tajam atau kilau lampu berlebih.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#48664C] text-[10px] font-bold text-white">
                  3
                </span>
                <span>Ratakan lipatan kain sebelum memotret, lalu gunakan fitur crop 1:1 untuk memusatkan motif.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sampel Uji Cepat (Seluruh 15 Motif) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#432912]">
            Uji Coba Sampel Dataset ({KATALOG.length} Motif)
          </h2>
          <p className="text-xs text-[#432912]/60">
            Klik salah satu kain di bawah untuk simulasi klasifikasi &amp; ensiklopedia instan
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {KATALOG.map((m) => (
            <KartuMotifBaru
              key={m.id}
              motif={m}
              favorit={fav.ada(m.id)}
              onToggle={(id) => {
                const sudahAda = fav.ada(id);
                fav.toggle(id);
                tampilkanToast(
                  sudahAda ? `${m.nama} dihapus dari favorit` : `${m.nama} disimpan ke favorit`
                );
              }}
            />
          ))}
        </div>
      </section>

      {bukaKamera && (
        <CameraCapture
          onCapture={(fileHasil) => {
            setBukaKamera(false);
            kirimKeHasil(fileHasil);
          }}
          onClose={() => setBukaKamera(false)}
        />
      )}

      {fileMentah && (
        <ImageCropperModal file={fileMentah} onBatal={() => setFileMentah(null)} onSelesai={kirimKeHasil} />
      )}
    </div>
  );
}