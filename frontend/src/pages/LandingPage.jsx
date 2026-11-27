import { useState , useEffect } from "react";
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
  const [autoScan, setAutoScan] = useState(true);
  useEffect(() => {
    if (!autoScan) return;
    const timer = setInterval(() => {
      setDemoId((prev) => {
        const idx = SAMPEL_DEMO.indexOf(prev);
        return SAMPEL_DEMO[(idx + 1) % SAMPEL_DEMO.length];
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [autoScan]);
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

              <h1 className="font-serif text-3xl font-extrabold leading-[1.16] tracking-tight text-[#432912] sm:text-4xl lg:text-[42px]">
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
                  <span className="text-xl font-extrabold text-[#432912] sm:text-2xl">82.5%</span>
                  <p className="text-[11px] font-semibold text-[#85522F]">Precision@5 CBIR</p>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-[#432912] sm:text-2xl">&lt;0.2s</span>
                  <p className="text-[11px] font-semibold text-[#85522F]">Analisis Vektor</p>
                </div>
              </div>
            </div>

            {/* Kanan: Kartu Simulasi Lensa AI Interaktif */}
            <div className="mx-auto w-full max-w-[445px]">
              <div className="glass-card-motion animate-float-card rounded-[30px] p-4 shadow-[0_24px_56px_rgba(67,41,18,0.13)] backdrop-blur-xl">
                {/* Header Kontrol Viewfinder */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoScan((v) => !v)}
                    title={autoScan ? "Jeda rotasi otomatis" : "Jalankan rotasi otomatis"}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E2D4C6] bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#6E4427] uppercase transition hover:border-[#AD7559]"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        autoScan ? "animate-pulse bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <span>{autoScan ? "Live Scan" : "Paused"}</span>
                  </button>

                  <div className="flex flex-wrap gap-1">
                    {SAMPEL_DEMO.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setDemoId(id);
                          setAutoScan(false);
                        }}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize transition ${
                          demoId === id
                            ? "bg-[#432912] text-white shadow-xs"
                            : "bg-white/85 text-[#432912]/70 hover:bg-white hover:text-[#432912]"
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bingkai Viewfinder Pemindai Kain */}
                <div className="relative h-[305px] overflow-hidden rounded-[22px] border border-[#432912]/15 bg-[#2B170A] text-white shadow-inner">
                  <LingkaranFotoBatik motif={motifDemo} className="h-full w-full transition-all duration-700" />
                  <div className="laser-beam" />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(28,15,6,0.48) 0%, transparent 40%, rgba(22,11,4,0.96) 100%)",
                    }}
                  />

                  {/* Sudut Viewfinder Kamera AI */}
                  <div className="pointer-events-none absolute inset-3.5">
                    <span className="absolute top-0 left-0 h-4 w-4 rounded-tl-md border-t-2 border-l-2 border-white/85" />
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-tr-md border-t-2 border-r-2 border-white/85" />
                    <span className="absolute bottom-[104px] left-0 h-4 w-4 rounded-bl-md border-b-2 border-l-2 border-white/55" />
                    <span className="absolute bottom-[104px] right-0 h-4 w-4 rounded-br-md border-b-2 border-r-2 border-white/55" />
                  </div>

                  {/* Badge Status Atas */}
                  <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 backdrop-blur-md">
                      <BatikMatchMascot size={18} />
                      <span className="text-[10px] font-bold text-white">EfficientNet-B0</span>
                    </div>
                    <span className="rounded-full border border-emerald-400/35 bg-emerald-500/25 px-2.5 py-1 text-[10px] font-extrabold text-emerald-200 backdrop-blur-md">
                      {motifDemo.id === "kawung"
                        ? "97.4%"
                        : motifDemo.id === "parang"
                        ? "96.8%"
                        : motifDemo.id === "megamendung"
                        ? "98.1%"
                        : "96.2%"}{" "}
                      Cocok
                    </span>
                  </div>

                  {/* Panel Hasil Identifikasi & Filosofi Singkat di Bawah */}
                  <div className="glass-photo-sheet absolute right-3.5 bottom-3.5 left-3.5 rounded-t-[20px] p-3.5">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-[10px] font-bold tracking-wide text-[#E5BFA9] uppercase">
                            {motifDemo.daerah}
                          </span>
                          <span className="text-white/40">&bull;</span>
                          <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-white/90">
                            {motifDemo.aliran}
                          </span>
                        </div>
                        <h2 className="font-serif mt-0.5 truncate text-base font-extrabold text-white">{motifDemo.nama}</h2>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-white/75">
                          {motifDemo.filosofi || motifDemo.deskripsi}
                        </p>
                      </div>
                      <Link
                        to="/hasil"
                        state={{ contohId: motifDemo.id }}
                        className="shrink-0 rounded-full bg-white px-3.5 py-2 text-[11px] font-extrabold text-[#432912] shadow-xs transition hover:scale-105"
                      >
                        Bedah &rarr;
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
              <h2 className="font-serif mt-0.5 text-xl font-bold text-[#432912] sm:text-2xl">
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
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#AD7559]/15 px-3 py-1 text-[10px] font-bold text-[#85522F] uppercase">
                  Smart Camera &amp; Cropper 1:1
                </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#AD7559]/15 text-[#85522F]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                  </span>
                </div>
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
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#432912]/10 px-3 py-1 text-[10px] font-bold text-[#432912] uppercase">
                  Ensiklopedia 4 Dimensi
                </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#432912]/10 text-[#432912]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  </span>
                </div>
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
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#432912]/10 px-3 py-1 text-[10px] font-bold text-[#432912] uppercase">
                  Open Dataset Reference
                </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#432912]/10 text-[#432912]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
                  </span>
                </div>
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
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#AD7559]/15 px-3 py-1 text-[10px] font-bold text-[#85522F] uppercase">
                  Multi-Role Workspace
                </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#AD7559]/15 text-[#85522F]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </span>
                </div>
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
                Bandingkan Motif Visual
              </span>
              <h2 className="font-serif text-xl font-bold leading-snug text-[#432912] sm:text-2xl">
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
                  Buka Bandingkan Motif &rarr;
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
              <h2 className="font-serif mt-0.5 text-xl font-bold text-[#432912] sm:text-2xl">
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
{/* Pola Tekstur Batik Kawung Halus + Cahaya Ambient */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23F4D5B8' stroke-width='1.5'%3E%3Cellipse cx='36' cy='18' rx='9' ry='16'/%3E%3Cellipse cx='36' cy='54' rx='9' ry='16'/%3E%3Cellipse cx='18' cy='36' rx='16' ry='9'/%3E%3Cellipse cx='54' cy='36' rx='16' ry='9'/%3E%3Ccircle cx='36' cy='36' r='3.5' fill='%23F4D5B8'/%3E%3Ccircle cx='0' cy='0' r='5'/%3E%3Ccircle cx='72' cy='0' r='5'/%3E%3Ccircle cx='0' cy='72' r='5'/%3E%3Ccircle cx='72' cy='72' r='5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "72px 72px",
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#AD7559]/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[#E5BFA9]/25 blur-3xl" />
          <div className="mx-auto mb-3 w-fit rounded-2xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md">
            <BatikMatchMascot size={52} />
          </div>
          <h2 className="font-serif text-xl font-extrabold sm:text-3xl">
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

      <footer className="mt-8 border-t border-[#432912]/12 bg-[#EFE4D8]/70 backdrop-blur-xs">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
          {/* Kolom 1: Identitas Platform */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <BatikMatchMascot size={30} />
              <div>
                <p className="font-serif text-base font-extrabold text-[#2D1A0B]">BatikMatch</p>
                <p className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
                  Wastra AI Studio
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[#432912]/75">
              Platform pengenalan pola dan ensiklopedia digital 15 motif batik Nusantara berbasis{" "}
              <strong>EfficientNet-B0</strong> dan pencarian kemiripan vektor <strong>Cosine Similarity</strong>.
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/lindanggara/batikmatch"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4C0AE] bg-white/85 px-3.5 py-1.5 text-[11px] font-bold text-[#432912] transition hover:border-[#AD7559] hover:text-[#AD7559]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>lindanggara/batikmatch</span>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi Studio */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold tracking-wider text-[#2D1A0B] uppercase">
              Eksplorasi Fitur
            </h3>
            <ul className="space-y-1.5 text-xs font-medium text-[#432912]/80">
              <li>
                <Link to="/studio" className="transition hover:text-[#AD7559]">
                  &rarr; Studio Pindai Kamera &amp; Unggah Foto
                </Link>
              </li>
              <li>
                <Link to="/jelajah" className="transition hover:text-[#AD7559]">
                  &rarr; Katalog &amp; Ensiklopedia 15 Motif
                </Link>
              </li>
              <li>
                <Link to="/bandingkan" className="transition hover:text-[#AD7559]">
                  &rarr; Bandingkan Dua Motif Visual
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="transition hover:text-[#AD7559]">
                  &rarr; Arsitektur Model &amp; Unduh Dataset
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tim Pengembang & Kontak */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold tracking-wider text-[#2D1A0B] uppercase">
              Tim Pengembang
            </h3>
            <p className="text-[11px] font-medium text-[#6E5440]">
              Sains Data Terapan &bull; Politeknik Elektronika Negeri Surabaya (PENS)
            </p>
            <ul className="grid grid-cols-1 gap-1.5 text-xs text-[#2D1A0B] sm:grid-cols-2">
              <li className="rounded-xl border border-[#DFD1C3] bg-white/75 px-3 py-1.5 font-semibold">
                Linda Anggara Wati
              </li>
              <li className="rounded-xl border border-[#DFD1C3] bg-white/75 px-3 py-1.5 font-semibold">
                Yuhanidz Habibah
              </li>
              <li className="rounded-xl border border-[#DFD1C3] bg-white/75 px-3 py-1.5 font-semibold">Intan Azzuhra Permadani</li>
              <li className="rounded-xl border border-[#DFD1C3] bg-white/75 px-3 py-1.5 font-semibold">Siti Cholilah Mi&apos;Rodtul Rohma</li>
            </ul>
            <p className="pt-0.5 text-[11px] text-[#6E5440]">
              Kolaborasi proyek via{" "}
              <a
                href="https://github.com/lindanggara/batikmatch/issues"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#AD7559] hover:underline"
              >
                GitHub Issues &amp; Discussions &rarr;
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-[#432912]/10 py-4 text-center text-[11px] font-medium text-[#432912]/60">
          &copy; {new Date().getFullYear()} BatikMatch Team &bull; Studio Pengenalan &amp; Ensiklopedia Motif Batik Nusantara
        </div>
      </footer>
    </div>
  );
}
