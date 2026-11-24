import { useState } from "react";
import { Link } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";

const ALIRAN_BATIK = [
  {
    id: "pedalaman",
    judul: "Batik Pedalaman (Keraton)",
    wilayah: "Yogyakarta & Surakarta",
    foto: "/motif/parang.jpg",
    palet: ["#432912", "#85522F", "#C59C8A", "#F3F1ED"],
    ringkasan:
      "Lahir di lingkungan keraton dengan aturan simbolis yang sakral. Didominasi pola geometris berulang dan warna sogan (cokelat tanah) serta indigo yang berwibawa.",
    contoh: ["Parang", "Kawung", "Sidomukti", "Truntum"],
  },
  {
    id: "pesisir",
    judul: "Batik Pesisir Nusantara",
    wilayah: "Cirebon, Pekalongan & Lasem",
    foto: "/motif/megamendung.jpg",
    palet: ["#2E3A59", "#AD7559", "#C59C8A", "#D5D2CA"],
    ringkasan:
      "Tumbuh di jalur perdagangan pesisir yang terbuka terhadap akulturasi budaya. Coraknya lebih bebas, dinamis, kaya motif awan, flora, dan gradasi warna ekspresif.",
    contoh: ["Megamendung", "Tujuh Rupa", "Lasem"],
  },
];

const ANATOMI_ISEN = [
  {
    nama: "Cecek & Cecek Pitu",
    peran: "Pengisi Bidang Halus",
    foto: "/motif/truntum.jpg",
    ket: "Titik-titik canting berukuran mikro yang memberi ritme dan tekstur lembut pada latar kain.",
  },
  {
    nama: "Sawut & Ukel",
    peran: "Aksen Garis & Lengkungan",
    foto: "/motif/kawung.jpg",
    ket: "Goresan garis sejajar rapat dan lengkung ikal untuk mempertegas kontur ornamen utama.",
  },
  {
    nama: "Klowongan & Mlinjon",
    peran: "Kerangka Geometris Utama",
    foto: "/motif/sidomukti.jpg",
    ket: "Garis pembatas struktural yang menjadi fitur dominan saat diekstraksi oleh filter konvolusi CNN.",
  },
];

const PIPELINE = [
  {
    step: "01",
    judul: "Normalisasi Citra",
    metrik: "224 × 224 px RGB",
    isi: "Standarisasi dimensi dan distribusi pencahayaan kain agar fitur tekstur terbaca konsisten.",
  },
  {
    step: "02",
    judul: "CNN Feature Extraction",
    metrik: "Deep Embedding Vector",
    isi: "Lapisan konvolusi menangkap garis lengkung, simetri geometris, dan kepadatan isen-isen.",
  },
  {
    step: "03",
    judul: "Cosine Similarity",
    metrik: "L2-Normalized Ranking",
    isi: "Menghitung kemiripan sudut vektor fitur untuk menampilkan prediksi utama & 3 kerabat terdekat.",
  },
];

const FAQ_LIST = [
  {
    tanya: "Apakah bisa memindai foto batik yang sedang dipakai sebagai baju?",
    jawab: "Bisa. Dekatkan kamera ke area kain yang menampilkan pengulangan motif secara utuh agar lipatan pakaian tidak mengaburkan struktur geometrisnya.",
  },
  {
    tanya: "Mengapa sistem menampilkan 3 motif kerabat di halaman hasil?",
    jawab: "Beberapa motif klasik memiliki kemiripan isen-isen atau struktur bidang. Tiga kandidat terdekat membantu pengguna membandingkan kemiripan visual secara transparan.",
  },
  {
    tanya: "Bagaimana cara menambah referensi motif baru ke dalam katalog?",
    jawab: "Pengelola dapat masuk melalui tombol Panel Admin di pojok kiri bawah sidebar untuk menambahkan entri motif baru beserta deskripsinya.",
  },
];

export default function AboutPage() {
  const [aliranAktif, setAliranAktif] = useState(0);
  const [faqAktif, setFaqAktif] = useState(0);
  const aliran = ALIRAN_BATIK[aliranAktif];

  return (
    <div className="space-y-9">
      {/* 1. HERO EDITORIAL SPLIT DENGAN PRATINJAU KAIN BATIK ASLI */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#6B3E21] via-[#4D2C16] to-[#2B170A] p-7 text-white shadow-[0_22px_50px_rgba(43,23,10,0.24)] sm:p-10">
        <img
          src="/motif/parang.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-[#C59C8A] backdrop-blur-md">
              ✦ Wastra Computer Vision Studio
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Melestarikan Warisan Batik Lewat Kecerdasan Visual
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-[#D5D2CA]/90 sm:text-sm">
              BatikLens menggabungkan kurasi ensiklopedia wastra Nusantara dengan arsitektur Convolutional Neural Network (CNN) untuk mengenali ragam motif klasik dari satu tangkapan kamera.
            </p>

            {/* 3 Angka Metrik Ringkas di Dalam Hero Glass */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                <p className="text-lg font-bold text-white">{KATALOG.length}</p>
                <p className="text-[10px] font-medium text-[#C59C8A]">Kelas Motif</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                <p className="text-lg font-bold text-white">224px</p>
                <p className="text-[10px] font-medium text-[#C59C8A]">Input Citra</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
                <p className="text-lg font-bold text-white">CBIR</p>
                <p className="text-[10px] font-medium text-[#C59C8A]">Cosine Match</p>
              </div>
            </div>
          </div>

          {/* Kolase Visual 2 Kartu Kain Asli Melayang di Kanan Hero */}
          <div className="hidden grid-cols-2 gap-3.5 lg:grid">
            <div className="relative h-56 overflow-hidden rounded-[24px] border border-white/25 shadow-xl">
              <img src="/motif/kawung.jpg" alt="Motif Kawung" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                Kawung &bull; Keraton
              </span>
            </div>
            <div className="relative mt-6 h-56 overflow-hidden rounded-[24px] border border-white/25 shadow-xl">
              <img src="/motif/megamendung.jpg" alt="Motif Megamendung" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                Megamendung &bull; Pesisir
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EKSPLORASI INTERAKTIF DUA ALIRAN WASTRA (DENGAN FOTO FULL-BLEED) */}
      <section className="card-motion motion-slide motion-reveal glass-panel overflow-hidden rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#432912]/10 pb-5">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
              Taksonomi Budaya Nusantara
            </span>
            <h2 className="mt-0.5 text-lg font-bold text-[#432912]">
              Perbandingan Ragam Batik Pedalaman &amp; Pesisir
            </h2>
          </div>

          <div className="flex rounded-full bg-[#D5D2CA]/60 p-1">
            {ALIRAN_BATIK.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAliranAktif(idx)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  aliranAktif === idx
                    ? "bg-[#AD7559] text-white shadow-sm"
                    : "text-[#432912]/65 hover:text-[#432912]"
                }`}
              >
                {idx === 0 ? "Pedalaman" : "Pesisir"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[320px_1fr]">
          {/* Kartu Foto Kain Full-Bleed */}
          <div className="relative h-64 overflow-hidden rounded-[24px] shadow-md">
            <img src={aliran.foto} alt={aliran.judul} className="h-full w-full object-cover transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2B170A]/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-bold tracking-wider text-[#C59C8A] uppercase">
                Sentra Utama
              </span>
              <p className="text-sm font-bold">{aliran.wilayah}</p>
            </div>
          </div>

          {/* Penjelasan & Palet Warna */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#432912]">{aliran.judul}</h3>
            <p className="text-xs leading-relaxed text-[#432912]/80 sm:text-sm">
              {aliran.ringkasan}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div>
                <span className="block text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
                  Palet Pewarnaan Khas
                </span>
                <div className="mt-2 flex items-center gap-2">
                  {aliran.palet.map((hex) => (
                    <span
                      key={hex}
                      title={hex}
                      className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
                  Motif Perwakilan
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {aliran.contoh.map((nama) => (
                    <span
                      key={nama}
                      className="rounded-full border border-[#C59C8A]/50 bg-white/75 px-3 py-0.5 text-[11px] font-semibold text-[#432912]"
                    >
                      {nama}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ANATOMI ISEN-ISEN DALAM KARTU FOTO FULL-BLEED */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
            Tekstur Mikro Kain
          </span>
          <h2 className="text-lg font-bold text-[#432912]">
            Anatomi Ornamen Pengisi (Isen-Isen)
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {ANATOMI_ISEN.map((item) => (
            <div
              key={item.nama}
              className="card-motion motion-tilt motion-reveal group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[28px] p-5 text-white shadow-[0_16px_36px_rgba(67,41,18,0.18)]"
            >
              <img
                src={item.foto}
                alt={item.nama}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(43,23,10,0.15) 0%, rgba(43,23,10,0.82) 55%, rgba(30,15,6,0.97) 100%)",
                }}
              />
              <div className="relative z-10">
                <span className="inline-block rounded-full border border-white/20 bg-white/15 px-3 py-0.5 text-[10px] font-semibold text-[#C59C8A] backdrop-blur-md">
                  {item.peran}
                </span>
                <h3 className="mt-2 text-base font-bold text-white">{item.nama}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#D5D2CA]/90">{item.ket}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PIPELINE ARSITEKTUR VISI KOMPUTER (GLASS CARDS) */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
            Arsitektur Kecerdasan Buatan
          </span>
          <h2 className="text-lg font-bold text-[#432912]">
            Alur Inferensi Model Klasifikasi
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {PIPELINE.map((p) => (
            <div
              key={p.step}
              className="card-motion motion-breath motion-reveal glass-latte rounded-[26px] p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#AD7559] text-sm font-bold text-white shadow-sm">
                  {p.step}
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1 font-mono text-[10px] font-bold text-[#85522F]">
                  {p.metrik}
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold text-[#432912]">{p.judul}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#432912]/75">{p.isi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. KOLEKSI REFERENSI & FAQ */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Daftar Interaktif Koleksi Motif */}
        <div className="card-motion motion-slide motion-reveal glass-panel flex flex-col justify-between rounded-[28px] p-6 sm:p-7">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#AD7559] uppercase">
                  Dataset Aktif
                </span>
                <h2 className="mt-0.5 text-base font-bold text-[#432912]">
                  {KATALOG.length} Motif Batik Terdaftar
                </h2>
              </div>
              <Link to="/jelajah" className="text-xs font-bold text-[#AD7559] hover:underline">
                Lihat Katalog &rarr;
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-2">
              {KATALOG.map((m) => (
                <Link
                  key={m.id}
                  to="/hasil"
                  state={{ contohId: m.id }}
                  className="group flex items-center gap-3 rounded-2xl border border-[#C59C8A]/40 bg-white/70 p-2.5 transition hover:bg-[#AD7559] hover:text-white"
                >
                  <img
                    src={m.gambar || `/motif/${m.id}.jpg`}
                    alt={m.nama}
                    className="h-10 w-10 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{m.nama}</p>
                    <p className="truncate text-[10px] opacity-70">{m.daerah}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/"
            className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-[#AD7559] text-xs font-bold text-white shadow-sm transition hover:brightness-105"
          >
            + Uji Coba Pindai Foto Sekarang
          </Link>
        </div>

        {/* FAQ Interaktif */}
        <div className="card-motion motion-slide motion-reveal glass-panel rounded-[28px] p-6 sm:p-7">
          <span className="text-[10px] font-bold tracking-wider text-[#AD7559] uppercase">
            Panduan Pengguna
          </span>
          <h2 className="mt-0.5 text-base font-bold text-[#432912]">
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="mt-4 divide-y divide-[#432912]/10">
            {FAQ_LIST.map((item, idx) => {
              const terbuka = faqAktif === idx;
              return (
                <div key={item.tanya} className="py-3.5 first:pt-1 last:pb-1">
                  <button
                    type="button"
                    onClick={() => setFaqAktif(terbuka ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left text-xs font-bold text-[#432912] sm:text-sm"
                  >
                    <span>{item.tanya}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D5D2CA]/70 text-xs text-[#432912]">
                      {terbuka ? "−" : "+"}
                    </span>
                  </button>
                  {terbuka && (
                    <p className="mt-2 text-xs leading-relaxed text-[#432912]/75">
                      {item.jawab}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}