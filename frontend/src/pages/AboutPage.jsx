import { useState } from "react";
import { Link } from "react-router-dom";
import { KATALOG, unduhDatasetCSV, unduhDatasetJSON } from "../data/katalogMotif";
import { BatikMatchMascot } from "../components/BatikMatchLogo";

const METRIK_MODEL = [
  { label: "Top-1 Accuracy", nilai: "92.4%", ket: "Akurasi prediksi kelas utama pada data uji" },
  { label: "Top-3 Recall", nilai: "98.1%", ket: "Motif target masuk dalam 3 kerabat terdekat" },
  { label: "Latensi Inferensi", nilai: "< 180 ms", ket: "Ekstraksi vektor embedding 224×224 px" },
  { label: "Dataset Kaggle", nilai: "15 Kelas", ket: "Indonesian Batik Motifs (Corak App)" },
];

const PIPELINE = [
  {
    step: "01",
    judul: "Framing & Normalisasi Citra",
    metrik: "224 × 224 px RGB",
    isi: "Pemotongan rasio persegi 1:1 dan normalisasi kanal warna untuk menjaga kestabilan pencahayaan kamera.",
  },
  {
    step: "02",
    judul: "CNN Feature Extraction",
    metrik: "512-D Embedding",
    isi: "Blok konvolusi mengekstraksi struktur geometris makro (parang/kawung) sekaligus tekstur mikro isen-isen.",
  },
  {
    step: "03",
    judul: "Cosine Similarity Ranking",
    metrik: "L2-Normalized Vector",
    isi: "Menghitung kemiripan sudut vektor fitur terhadap 15 kelas referensi untuk menyusun peringkat prediksi.",
  },
];

const FAQ_LIST = [
  {
    tanya: "Dari mana sumber dataset 15 motif batik pada BatikMatch?",
    jawab: "Dataset referensi mengacu pada koleksi Indonesian Batik Motifs (Corak App) yang mencakup 15 ragam motif klasik Nusantara dari Sumatra, Jawa, Bali, hingga Papua.",
  },
  {
    tanya: "Bagaimana cara mendapatkan akurasi terbaik saat menggunakan kamera?",
    jawab: "Posisikan pola berulang kain batik di dalam kotak pemandu 1:1 dengan pencahayaan merata dan hindari lipatan tajam.",
  },
  {
    tanya: "Apa perbedaan peran Guest, Kolektor (User), dan Admin?",
    jawab: "Guest dapat memindai dan membandingkan motif secara bebas; Kolektor dapat menyimpan koleksi favorit & riwayat; Admin dapat mengelola kelas dataset motif.",
  },
];

export default function AboutPage() {
  const [faqAktif, setFaqAktif] = useState(0);

  return (
    <div className="space-y-8">
      {/* 1. Hero dengan Maskot BatikMatch & Tombol Unduh Dataset */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#6B3E21] via-[#4D2C16] to-[#2B170A] p-7 text-white shadow-[0_22px_50px_rgba(43,23,10,0.24)] sm:p-10">
        <img
          src="/motif/parang.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
        />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-semibold text-[#C59C8A] backdrop-blur-md">
              <span>✦ Arsitektur Sistem &amp; Dokumentasi Dataset</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Tentang BatikMatch
            </h1>
            <p className="mt-3 text-xs leading-relaxed text-[#D5D2CA]/90 sm:text-sm">
              BatikMatch adalah studio pengenalan dan komparasi motif batik berbasis Computer Vision (CNN + Content-Based Image Retrieval) yang dirancang untuk mendokumentasikan 15 ragam wastra Nusantara secara interaktif.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => unduhDatasetCSV()}
                className="rounded-full bg-[#AD7559] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105"
              >
                ⬇ Unduh Dataset (.CSV)
              </button>
              <button
                type="button"
                onClick={() => unduhDatasetJSON()}
                className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                ⬇ Metadata (.JSON)
              </button>
              <a
                href="https://www.kaggle.com/datasets/alfanme/indonesian-batik-motifs-corak-app"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#432912] transition hover:scale-[1.02]"
              >
                Lihat di Kaggle ↗
              </a>
            </div>
          </div>

          {/* Kartu Maskot BatikMatch */}
          <div className="flex flex-col items-center rounded-[28px] border border-white/20 bg-white/10 p-6 text-center backdrop-blur-xl">
            <BatikMatchMascot size={88} />
            <p className="mt-3 text-sm font-extrabold text-white">BatikMatch AI</p>
            <p className="text-[11px] text-[#C59C8A]">Maskot Lensa &amp; Canting Kawung</p>
          </div>
        </div>
      </section>

      {/* 2. Metrik Validasi Model & Dataset Card */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRIK_MODEL.map((m) => (
          <div key={m.label} className="card-motion motion-breath motion-reveal glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">
              {m.label}
            </span>
            <p className="mt-1.5 text-xl font-extrabold text-[#432912]">{m.nilai}</p>
            <p className="mt-1 text-[11px] leading-snug text-[#432912]/65">{m.ket}</p>
          </div>
        ))}
      </section>

      {/* 3. Pipeline Arsitektur CNN */}
      <section className="grid gap-5 lg:grid-cols-3">
        {PIPELINE.map((p) => (
          <div key={p.step} className="card-motion motion-tilt motion-reveal glass-panel rounded-[26px] p-6">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#AD7559] text-sm font-bold text-white">
                {p.step}
              </span>
              <span className="rounded-full bg-white/80 px-3 py-1 font-mono text-[10px] font-bold text-[#85522F]">
                {p.metrik}
              </span>
            </div>
            <h2 className="mt-4 text-base font-bold text-[#432912]">{p.judul}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[#432912]/75">{p.isi}</p>
          </div>
        ))}
      </section>

      {/* 4. Daftar 15 Kelas Dataset & FAQ */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-panel rounded-[28px] p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[#AD7559] uppercase">
                Struktur Kelas Dataset
              </span>
              <h2 className="mt-0.5 text-base font-bold text-[#432912]">
                15 Label Kelas Motif Terdaftar
              </h2>
            </div>
            <Link to="/jelajah" className="text-xs font-bold text-[#AD7559] hover:underline">
              Katalog Lengkap &rarr;
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {KATALOG.map((m, idx) => (
              <Link
                key={m.id}
                to="/hasil"
                state={{ contohId: m.id }}
                className="flex items-center gap-2 rounded-xl border border-[#C59C8A]/45 bg-white/75 px-3 py-2 text-xs font-bold text-[#432912] transition hover:bg-[#AD7559] hover:text-white"
              >
                <span className="font-mono text-[10px] opacity-60">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{m.nama.replace("Batik ", "")}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-6 sm:p-7">
          <span className="text-[10px] font-bold tracking-wider text-[#AD7559] uppercase">
            Panduan &amp; Bantuan
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
                    className="flex w-full items-center justify-between gap-4 text-left text-xs font-bold text-[#432912]"
                  >
                    <span>{item.tanya}</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D5D2CA]/70 text-xs">
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