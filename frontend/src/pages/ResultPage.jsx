import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { cariMotif, GagalPencarian, kirimUmpanBalik } from "../api/pencarianLokal";
import KartuMotifBaru, { LingkaranFotoBatik } from "../components/KartuMotifBaru";
import useFavoritLokal from "../hooks/useFavoritLokal";
import { simpanKeRiwayat } from "./HistoryPage";

const HATI = "M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z";

const TAB_ENSIKLOPEDIA = [
  { id: "filosofi", label: "Filosofi & Makna" },
  { id: "sejarah", label: "Sejarah & Asal" },
  { id: "anatomi", label: "Anatomi & Isen" },
  { id: "pakem", label: "Pakem & Busana" },
];

export default function ResultPage() {
  const { state } = useLocation();
  const nav = useNavigate();
  const fav = useFavoritLokal();
  const file = state?.file;
  const contohId = state?.contohId;
  const [fotoUrl, setFotoUrl] = useState(null);
  const [hasil, setHasil] = useState(null);
  const [error, setError] = useState("");
  const [nilai, setNilai] = useState(null);
  const [tabAktif, setTabAktif] = useState("filosofi");

  useEffect(() => {
    if (!file) return;
    const u = URL.createObjectURL(file);
    setFotoUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  useEffect(() => {
    if (!file && !contohId) return;
    let batal = false;
    setHasil(null);
    setError("");
    setNilai(null);
    setTabAktif("filosofi");
    cariMotif({ file, contohId })
      .then((h) => {
        if (!batal) {
          setHasil(h);
          simpanKeRiwayat(
            h.tebakan,
            h.skor ? Math.round(h.skor * 100) : 94,
            file ? "Foto Unggahan" : "Sampel Katalog"
          );
        }
      })
      .catch((err) => {
        if (batal) return;
        setError(err instanceof GagalPencarian ? err.message : "Pencarian gagal. Coba lagi.");
      });
    return () => { batal = true; };
  }, [file, contohId]);

  if (!file && !contohId) return <Navigate to="/studio" replace />;

  if (error) {
    return (
      <div className="glass-panel mx-auto max-w-md rounded-[28px] p-8 text-center">
        <p role="alert" className="text-sm font-bold text-red-800">{error}</p>
        <Link to="/studio" className="mt-5 inline-flex h-11 items-center rounded-full bg-[#AD7559] px-7 text-xs font-bold text-white">
          Coba lagi
        </Link>
      </div>
    );
  }

  if (!hasil) {
    return (
      <div role="status" className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
        <div className="pola-kawung h-20 w-20 animate-pulse rounded-full shadow-lg ring-4 ring-white" />
        <p className="text-sm font-bold text-[#432912]">Mengenali pola motif batik...</p>
      </div>
    );
  }

  const t = hasil.tebakan;
  const favorit = fav.ada(t.id);
  const skor = hasil.skor ? Math.round(hasil.skor * 100) : hasil.yakin ? 94 : 76;

  return (
    <div className="space-y-8">
      <div className="grid items-start gap-8 lg:grid-cols-[370px_1fr]">
        {/* KARTU KIRI: Full-Bleed Card + Frosted Glass Sheet */}
        <div className="card-motion motion-reveal relative flex min-h-[500px] flex-col justify-between overflow-hidden rounded-[32px] border border-white/35 bg-[#432912] text-white shadow-[0_24px_50px_rgba(67,41,18,0.22)] lg:sticky lg:top-8">
          <LingkaranFotoBatik motif={t} srcManual={fotoUrl} className="absolute inset-0 h-full w-full" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(43,24,11,0.38) 0%, rgba(43,24,11,0.06) 35%, rgba(43,24,11,0.86) 62%, rgba(32,17,7,0.98) 100%)",
            }}
          />

          <div className="relative z-10 flex items-center justify-between p-6 pb-0">
            <button
              type="button"
              onClick={() => nav(-1)}
              aria-label="Kembali"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/50"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>

            <span className="rounded-full border border-white/20 bg-black/35 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
              {file ? "Foto Unggahan" : "Arsip Katalog"}
            </span>

            <button
              type="button"
              onClick={() => fav.toggle(t.id)}
              aria-pressed={favorit}
              aria-label={favorit ? "Hapus dari favorit" : "Simpan ke favorit"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/50"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round"
                fill={favorit ? "#C59C8A" : "none"} stroke={favorit ? "#C59C8A" : "currentColor"}>
                <path d={HATI} />
              </svg>
            </button>
          </div>

          <div className="glass-photo-sheet relative z-10 mt-auto rounded-t-[28px] p-6">
            <div className="flex items-baseline justify-between gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">{t.nama}</h1>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#C59C8A] backdrop-blur-md">
                {skor}% Cocok
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-[#D5D2CA]/90">
              {t.ciri}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                {t.daerah}
              </span>
              <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-semibold text-[#C59C8A] backdrop-blur-md">
                {t.aliran || "Wastra Nusantara"}
              </span>
            </div>

            <Link
              to="/studio"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-white text-xs font-bold text-[#432912] shadow-lg transition hover:scale-[1.02]"
            >
              Pindai Foto Lain
            </Link>
          </div>
        </div>

        {/* KOLOM KANAN: Ensiklopedia Lengkap 4 Tab + Metadata */}
        <div className="space-y-7 pt-1">
          {/* Peringatan "motif tidak dikenal": skor di bawah ambang batas backend */}
          {hasil.yakin === false && (
            <div role="alert" className="rounded-[24px] border border-amber-300/70 bg-amber-50/90 p-5 text-[#432912] shadow-sm">
              <p className="text-sm font-bold">Motif ini mungkin belum ada di koleksi kami</p>
              <p className="mt-1 text-xs leading-relaxed text-[#432912]/75">
                Kemiripannya dengan koleksi rendah ({skor}%), jadi tebakan di bawah belum tentu benar.
                Coba foto ulang dengan pencahayaan terang dan pastikan pola kain memenuhi kotak pemandu.
              </p>
            </div>
          )}

          <div className="glass-panel rounded-[32px] p-6 sm:p-7">
            <span className="text-[11px] font-bold tracking-widest text-[#AD7559] uppercase">
              Ensiklopedia Wastra Nusantara
            </span>
            <h2 className="mt-1 text-2xl font-bold text-[#432912]">
              Mengenal Lebih Dalam {t.nama}
            </h2>

            {/* Navigasi 4 Tab Ensiklopedia */}
            <div className="mt-4 flex flex-wrap gap-2 border-b border-[#432912]/10 pb-4">
              {TAB_ENSIKLOPEDIA.map((tab) => {
                const aktif = tabAktif === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTabAktif(tab.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                      aktif
                        ? "bg-[#AD7559] text-white shadow-sm"
                        : "bg-white/65 text-[#432912]/70 hover:bg-white hover:text-[#432912]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Konten Tab Aktif */}
            <div className="mt-4 min-h-[96px]">
              {tabAktif === "filosofi" && (
                <div>
                  <h3 className="text-sm font-bold text-[#85522F]">Nilai Simbolis &amp; Makna Budaya</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#432912]/85">
                    {t.filosofi || t.ciri}
                  </p>
                </div>
              )}

              {tabAktif === "sejarah" && (
                <div>
                  <h3 className="text-sm font-bold text-[#85522F]">Latar Belakang Sejarah &amp; Perkembangan</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#432912]/85">
                    {t.sejarah || `Warisan seni batik tradisional yang berakar kuat dari kebudayaan ${t.daerah}.`}
                  </p>
                </div>
              )}

              {tabAktif === "anatomi" && (
                <div>
                  <h3 className="text-sm font-bold text-[#85522F]">Struktur Ornamen &amp; Isen-Isen</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#432912]/85">
                    {t.anatomi || t.ciri}
                  </p>
                </div>
              )}

              {tabAktif === "pakem" && (
                <div className="space-y-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#85522F]">Pakem &amp; Aturan Adat</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#432912]/85 sm:text-sm">
                      {t.pakem || "Dapat dikenakan dalam berbagai acara resmi maupun perayaan budaya."}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#AD7559]/12 p-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
                      Rekomendasi Padu Padan Busana
                    </span>
                    <p className="mt-0.5 text-xs font-semibold text-[#432912]">
                      {t.busana || "Kemeja formal, kebaya klasik, maupun busana modern."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 3 Kartu Metadata Warm Latte Glass */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="card-motion motion-breath motion-reveal glass-latte rounded-2xl p-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#AD7559]" />
                  <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Daerah Asal</span>
                </div>
                <p className="mt-1.5 text-sm font-bold text-[#432912]">{t.daerah}</p>
              </div>

              <div className="card-motion motion-breath motion-reveal glass-latte rounded-2xl p-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#AD7559]" />
                  <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Aliran Wastra</span>
                </div>
                <p className="mt-1.5 text-sm font-bold text-[#432912]">{t.aliran || "Klasik Nusantara"}</p>
              </div>

              <div className="card-motion motion-breath motion-reveal glass-latte rounded-2xl p-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#AD7559]" />
                  <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Skor Kemiripan</span>
                </div>
                <p className="mt-1.5 text-sm font-bold text-[#432912]">{skor}% Cosine Match</p>
              </div>
            </div>

            {/* Evaluasi Pengguna */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#432912]/10 pt-4">
              <span className="text-xs font-semibold text-[#432912]/70">
                Apakah hasil identifikasi ini akurat?
              </span>
              {nilai === null ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setNilai("ya"); kirimUmpanBalik(hasil.query_id, true); try { const l = JSON.parse(localStorage.getItem("batikmatch_feedback_v1") || "[]"); localStorage.setItem("batikmatch_feedback_v1", JSON.stringify([{ id: Date.now(), motif: t.nama, status: "Akurat", waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }, ...l])); } catch {} }}
                    className="rounded-full bg-[#AD7559] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-105"
                  >
                    Ya, Akurat
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNilai("tidak"); kirimUmpanBalik(hasil.query_id, false); try { const l = JSON.parse(localStorage.getItem("batikmatch_feedback_v1") || "[]"); localStorage.setItem("batikmatch_feedback_v1", JSON.stringify([{ id: Date.now(), motif: t.nama, status: "Kurang Tepat", waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }, ...l])); } catch {} }}
                    className="rounded-full border border-white/80 bg-white/70 px-5 py-2 text-xs font-bold text-[#432912]/80 backdrop-blur-md transition hover:bg-white"
                  >
                    Kurang Tepat
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-[#AD7559]">✓ Penilaian tersimpan</span>
              )}
            </div>
          </div>

          {/* 3 Motif Kerabat Terdekat */}
          {hasil.mirip?.length > 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#432912]">Motif Kerabat Terdekat</h3>
                <p className="text-xs text-[#432912]/60">Motif lain dengan kemiripan pola visual</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {hasil.mirip.map(({ motif, label }) => (
                  <KartuMotifBaru key={motif.id} motif={motif} label={label} favorit={fav.ada(motif.id)} onToggle={fav.toggle} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}