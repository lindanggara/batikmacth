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

      {/* Dropzone Unggah & Kamera */}
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
        className={`glass-panel relative overflow-hidden rounded-[32px] p-8 text-center transition-all sm:p-12 ${
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

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#85522F] to-[#432912] text-2xl text-white shadow-md">
          ✦
        </div>

        <h2 className="mt-4 text-lg font-bold text-[#432912] sm:text-xl">
          Unggah Foto Kain atau Pindai Langsung
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-[#432912]/70 sm:text-sm">
          Tarik dan lepas foto kain batik ke area ini, pilih dari galeri (dilengkapi pemotong framing 1:1), atau buka kamera langsung.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-[#AD7559] px-7 py-3 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] hover:brightness-105"
          >
            Pilih Foto dari Galeri
          </button>

          <button
            type="button"
            onClick={() => setBukaKamera(true)}
            className="rounded-full border border-[#C59C8A]/70 bg-white/85 px-7 py-3 text-xs font-bold text-[#432912] shadow-sm backdrop-blur-md transition hover:scale-[1.02] hover:bg-white"
          >
            📷 Buka Kamera
          </button>
        </div>
      </section>

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
        <ImageCropperModal
          file={fileMentah}
          onConfirm={kirimKeHasil}
          onCancel={() => setFileMentah(null)}
        />
      )}
    </div>
  );
}