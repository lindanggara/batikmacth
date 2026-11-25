import { useState } from "react";
import { Link } from "react-router-dom";
import BatikMatchLogo, { BatikMatchMascot } from "../components/BatikMatchLogo";
import { KATALOG } from "../data/katalogMotif";
import KartuMotifBaru, { LingkaranFotoBatik } from "../components/KartuMotifBaru";
import useFavoritLokal from "../hooks/useFavoritLokal";
import { useAuth } from "../context/AuthContext";

const SAMPEL_DEMO = ["kawung", "parang", "megamendung", "lasem"];

export default function LandingPage() {
  const fav = useFavoritLokal();
  const { user, isAdmin } = useAuth();
  const [demoId, setDemoId] = useState("kawung");
  const [sliderDemo, setSliderDemo] = useState(50);

  const motifDemo = KATALOG.find((m) => m.id === demoId) || KATALOG[0];
  const motifKiri = KATALOG.find((m) => m.id === "kawung") || KATALOG[0];
  const motifKanan = KATALOG.find((m) => m.id === "megamendung") || KATALOG[1];

  return (
    <div className="min-h-screen overflow-x-hidden text-[#432912] selection:bg-[#AD7559]/30">
      {/* 1. FLOATING NAVBAR (Sejajar presisi max-w-[1140px]) */}
      <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6">
        <div className="mx-auto flex max-w-[1140px] items-center justify-between gap-4 rounded-full border border-white/75 bg-[#F3F1ED]/85 px-5 py-2.5 shadow-[0_10px_28px_rgba(67,41,18,0.07)] backdrop-blur-xl">
          <Link to="/">
            <BatikMatchLogo size={36} />
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-bold text-[#432912]/75 md:flex">
            <a href="#demo-interaktif" className="transition hover:text-[#AD7559]">Simulasi AI</a>
            <a href="#fitur-utama" className="transition hover:text-[#AD7559]">Fitur Studio</a>
            <a href="#komparasi-preview" className="transition hover:text-[#AD7559]">Komparasi</a>
            <a href="#katalog-sorotan" className="transition hover:text-[#AD7559]">15 Motif</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to={isAdmin ? "/admin" : "/admin/login"}
              className="rounded-full border border-[#C59C8A]/65 bg-white/85 px-3.5 py-1.5 text-xs font-bold text-[#432912] transition hover:bg-white"
            >
              {user ? user.nama : "Masuk"}
            </Link>
            <Link
              to="/studio"
              className="rounded-full bg-[#AD7559] px-4 py-1.5 text-xs font-extrabold text-white shadow-xs transition hover:brightness-105"
            >
              Buka Studio &rarr;
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1140px] space-y-12 px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        {/* 2. HERO PROPORSIONAL (Pas satu layar laptop tanpa terpotong) */}
        <section
          id="demo-interaktif"
          className="glass-panel rounded-[32px] p-6 sm:p-8 lg:p-10"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Kiri: Teks & CTA */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C59C8A]/70 bg-white/85 px-3.5 py-1 text-[11px] font-bold text-[#85522F]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span>Wastra AI &bull; 15 Kelas Batik Nusantara</span>
              </div>

              <h1 className="text-3xl font-extrabold leading-[1.16] tracking-tight text-[#432912] sm:text-4xl lg:text-[42px]">
                Pindai Pola, Ungkap Jiwa{" "}
                <span className="italic text-[#AD7559]">Batik Indonesia.</span>
              </h1>

              <p className="max-w-lg text-xs leading-relaxed text-[#432912]/75 sm:text-sm">
                Dari pakem klasik keraton hingga corak pesisir yang ekspresif. Arahkan kamera atau unggah foto kainmu—<strong>BatikMatch</strong> mengidentifikasi motif, filosofi, dan sejarahnya dalam sekejap.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 rounded-full bg-[#432912] px-6 py-3 text-xs font-extrabold text-white shadow-[0_12px_26px_rgba(67,41,18,0.24)] transition hover:scale-[1.02] hover:bg-[#85522F]"
                >
                  <span>✦ Mulai Pindai Sekarang</span>
                </Link>

                <Link
                  to="/jelajah"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C59C8A]/80 bg-white/85 px-5 py-3 text-xs font-bold text-[#432912] transition hover:bg-white"
                >
                  Jelajahi {KATALOG.length} Motif
                </Link>
              </div>

              {/* 3 Pilar Metrik Ringkas */}
              <div className="grid max-w-md grid-cols-3 gap-4 border-t border-[#432912]/10 pt-4">
                <div>
                  <span className="text-xl font-extrabold text-[#432912] sm:text-2xl">15</span>
                  <p className="text-[11px] font-semibold text-[#85522F]">Ragam Motif Asli</p>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-[#432912] sm:text-2xl">92.4%</span>
                  <p className="text-[11px] font-semibold text-[#85522F]">Akurasi Model CNN</p>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-[#432912] sm:text-2xl">&lt;0.2s</span>
                  <p className="text-[11px] font-semibold text-[#85522F]">Analisis Vektor</p>
                </div>
              </div>
            </div>

            {/* Kanan: Kartu Simulasi Lensa AI Kompak */}
            <div className="mx-auto w-full max-w-[400px]">
              <div className="rounded-[26px] border border-white/75 bg-white/55 p-3.5 shadow-[0_18px_40px_rgba(67,41,18,0.12)] backdrop-blur-md">
                <div className="mb-2.5 flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
                    Simulasi Lensa:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SAMPEL_DEMO.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDemoId(id)}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize transition ${
                          demoId === id
                            ? "bg-[#AD7559] text-white"
                            : "bg-white/80 text-[#432912]/70 hover:bg-white"
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-[270px] overflow-hidden rounded-[20px] border border-white/50 bg-[#2B170A] text-white">
                  <LingkaranFotoBatik motif={motifDemo} className="h-full w-full transition-all duration-500" />
                  <div className="laser-beam" />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(43,24,11,0.28) 0%, transparent 40%, rgba(28,15,6,0.94) 100%)",
                    }}
                  />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 backdrop-blur-md">
                      <BatikMatchMascot size={18} />
                      <span className="text-[10px] font-bold text-white">BatikMatch AI</span>
                    </div>
                    <span className="rounded-full bg-emerald-500/25 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-200 backdrop-blur-md">
                      96.2% Cocok
                    </span>
                  </div>

                  <div className="glass-photo-sheet absolute inset-x-0 bottom-0 rounded-t-[20px] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block truncate text-[10px] font-bold text-[#C59C8A] uppercase">
                          {motifDemo.daerah}
                        </span>
                        <h2 className="truncate text-base font-extrabold text-white">{motifDemo.nama}</h2>
                      </div>
                      <Link
                        to="/hasil"
                        state={{ contohId: motifDemo.id }}
                        className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[10px] font-extrabold text-[#432912] transition hover:scale-105"
                      >
                        Bedah Motif &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PITA BERJALAN 15 RAGAM MOTIF */}
        <section className="glass-latte overflow-hidden rounded-full py-3">
          <div className="marquee-track items-center gap-6 px-4">
            {[...KATALOG, ...KATALOG].map((m, idx) => (
              <Link
                key={`${m.id}-${idx}`}
                to="/hasil"
                state={{ contohId: m.id }}
                className="inline-flex items-center gap-2 whitespace-nowrap text-xs font-bold text-[#432912]/80 transition hover:text-[#AD7559]"
              >
                <span className="text-[#AD7559]">✦</span>
                <span>{m.nama}</span>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#85522F]">
                  {m.daerah.split(",")[0]}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. GRID FITUR STUDIO (2x2 Simetris Proporsional) */}
        <section id="fitur-utama" className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
                Ekosistem Studio Wastra
              </span>
              <h2 className="mt-0.5 text-xl font-bold text-[#432912] sm:text-2xl">
                Dirancang untuk Pelajar, Kolektor &amp; Kurator
              </h2>
            </div>
            <Link to="/tentang" className="text-xs font-bold text-[#AD7559] hover:underline">
              Pelajari Arsitektur CNN &rarr;
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="card-motion motion-tilt glass-panel flex flex-col justify-between rounded-[26px] p-6">
              <div>
                <span className="rounded-full bg-[#AD7559]/15 px-3 py-1 text-[10px] font-bold text-[#85522F] uppercase">
                  Smart Camera &amp; Cropper 1:1
                </span>
                <h3 className="mt-3 text-base font-bold text-[#432912] sm:text-lg">
                  Pemindaian Presisi Tanpa Gangguan Latar
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#432912]/75">
                  Kamera langsung dengan kotak pemandu persegi serta pemotong gambar interaktif agar model hanya membaca tekstur ornamen kain batik.
                </p>
              </div>
              <div className="mt-4">
                <Link to="/studio" className="text-xs font-extrabold text-[#AD7559] hover:underline">
                  Coba Kamera &amp; Cropper &rarr;
                </Link>
              </div>
            </div>

            <div className="card-motion motion-tilt glass-latte flex flex-col justify-between rounded-[26px] p-6">
              <div>
                <span className="rounded-full bg-[#432912]/10 px-3 py-1 text-[10px] font-bold text-[#432912] uppercase">
                  Ensiklopedia 4 Dimensi
                </span>
                <h3 className="mt-3 text-base font-bold text-[#432912] sm:text-lg">
                  Sejarah, Isen-Isen &amp; Pakem Adat
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#432912]/75">
                  Setiap motif dibedah lengkap mulai dari nilai filosofis, anatomi motif pengisi, larangan adat, hingga rekomendasi busana.
                </p>
              </div>
              <div className="mt-4">
                <Link to="/jelajah" className="text-xs font-extrabold text-[#85522F] hover:underline">
                  Buka Ensiklopedia Motif &rarr;
                </Link>
              </div>
            </div>

            <div className="card-motion motion-tilt glass-latte flex flex-col justify-between rounded-[26px] p-6">
              <div>
                <span className="rounded-full bg-[#432912]/10 px-3 py-1 text-[10px] font-bold text-[#432912] uppercase">
                  Open Dataset Reference
                </span>
                <h3 className="mt-3 text-base font-bold text-[#432912] sm:text-lg">
                  15 Kelas Kaggle &amp; Ekspor Metadata
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#432912]/75">
                  Selaras dengan dataset <em>Indonesian Batik Motifs (Corak App)</em> dan dapat diunduh langsung dalam format CSV maupun JSON.
                </p>
              </div>
              <div className="mt-4">
                <Link to="/jelajah" className="text-xs font-extrabold text-[#85522F] hover:underline">
                  Unduh Dataset Sekarang &rarr;
                </Link>
              </div>
            </div>

            <div className="card-motion motion-tilt glass-panel flex flex-col justify-between rounded-[26px] p-6">
              <div>
                <span className="rounded-full bg-[#AD7559]/15 px-3 py-1 text-[10px] font-bold text-[#85522F] uppercase">
                  Multi-Role Workspace
                </span>
                <h3 className="mt-3 text-base font-bold text-[#432912] sm:text-lg">
                  Akses Terpisah Pengunjung, Kolektor &amp; Kurator
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#432912]/75">
                  Pengunjung langsung memindai gratis, Kolektor menyimpan riwayat &amp; favorit, dan Kurator mengelola kelas dataset di Panel Admin.
                </p>
              </div>
              <div className="mt-4">
                <Link to="/admin/login" className="text-xs font-extrabold text-[#AD7559] hover:underline">
                  Masuk sebagai Kolektor / Admin &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE SPLIT SLIDER PREVIEW */}
        <section id="komparasi-preview" className="glass-panel rounded-[30px] p-6 sm:p-8">
          <div className="grid items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
                Laboratorium Komparasi Visual
              </span>
              <h2 className="text-xl font-bold leading-snug text-[#432912] sm:text-2xl">
                Bandingkan Karakter Pedalaman vs Pesisir
              </h2>
              <p className="text-xs leading-relaxed text-[#432912]/75 sm:text-sm">
                Geser pembatas lensa di samping untuk melihat kontras langsung antara simetri geometris <strong>Batik Kawung</strong> (Yogyakarta) dan lengkung awan bergradasi <strong>Batik Megamendung</strong> (Cirebon).
              </p>
              <div className="pt-2">
                <Link
                  to="/bandingkan"
                  className="inline-flex items-center gap-2 rounded-full bg-[#AD7559] px-5 py-2.5 text-xs font-extrabold text-white shadow-xs transition hover:brightness-105"
                >
                  Buka Laboratorium Komparasi &rarr;
                </Link>
              </div>
            </div>

            <div className="relative h-64 w-full select-none overflow-hidden rounded-[22px] border border-white/50 bg-[#432912] shadow-md sm:h-72">
              <LingkaranFotoBatik motif={motifKanan} className="absolute inset-0 h-full w-full" />

              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderDemo}% 0 0)` }}
              >
                <LingkaranFotoBatik motif={motifKiri} className="h-full w-full" />
              </div>

              <div
                className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.65)]"
                style={{ left: `${sliderDemo}%` }}
              >
                <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#432912]/90 text-xs font-bold text-white shadow-lg">
                  ⇄
                </div>
              </div>

              <input
                type="range"
                min="8"
                max="92"
                value={sliderDemo}
                onChange={(e) => setSliderDemo(Number(e.target.value))}
                aria-label="Geser perbandingan Kawung dan Megamendung"
                className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
              />

              <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                Pedalaman: Kawung
              </span>
              <span className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                Pesisir: Megamendung
              </span>
            </div>
          </div>
        </section>

        {/* 6. SOROTAN KOLEKSI & BANNER PENUTUP */}
        <section id="katalog-sorotan" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
                Koleksi Nusantara
              </span>
              <h2 className="mt-0.5 text-xl font-bold text-[#432912] sm:text-2xl">
                Ragam Motif Populer dalam Dataset
              </h2>
            </div>
            <Link to="/jelajah" className="text-xs font-bold text-[#AD7559] hover:underline">
              Lihat Semua {KATALOG.length} Motif &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {KATALOG.slice(0, 4).map((m) => (
              <KartuMotifBaru key={m.id} motif={m} favorit={fav.ada(m.id)} onToggle={fav.toggle} />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#6B3E21] via-[#4D2C16] to-[#2B170A] p-8 text-center text-white shadow-[0_20px_48px_rgba(43,23,10,0.22)] sm:p-10">
          <div className="mx-auto mb-3 w-fit rounded-2xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md">
            <BatikMatchMascot size={52} />
          </div>
          <h2 className="text-xl font-extrabold sm:text-3xl">
            Mulai Eksplorasi Wastra dengan BatikMatch
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-[#D5D2CA]/90 sm:text-sm">
            Masuk ke ruang kerja studio untuk memindai foto kain batik secara langsung, membandingkan detail ornamen, dan memperkaya wawasan budaya Nusantara.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/studio"
              className="rounded-full bg-[#AD7559] px-7 py-3 text-xs font-extrabold text-white shadow-md transition hover:scale-[1.02] hover:brightness-105"
            >
              ✦ Masuk ke Studio Pindai
            </Link>
            <Link
              to="/jelajah"
              className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Lihat 15 Kelas Motif
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#432912]/10 py-5 text-center text-xs font-medium text-[#432912]/60">
        BatikMatch &bull; Studio Pengenalan &amp; Ensiklopedia Motif Batik Nusantara
      </footer>
    </div>
  );
}