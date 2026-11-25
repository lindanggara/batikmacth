import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BatikMatchLogo from "../components/BatikMatchLogo";

export default function AdminDashboardPage() {
  const nav = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { tampilkanToast } = useToast();
  const [tab, setTab] = useState("dataset");
  const [daftarMotif, setDaftarMotif] = useState(KATALOG);
  const [namaBaru, setNamaBaru] = useState("");
  const [daerahBaru, setDaerahBaru] = useState("");
  const [ciriBaru, setCiriBaru] = useState("");

  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("batikmatch_feedback_v1") || "[]");
      if (saved.length > 0) return saved;
      return [
        { id: 1, motif: "Batik Kawung", status: "Akurat", waktu: "14:10" },
        { id: 2, motif: "Batik Megamendung", status: "Akurat", waktu: "13:45" },
        { id: 3, motif: "Batik Poleng", status: "Kurang Tepat", waktu: "12:20" },
      ];
    } catch {
      return [];
    }
  });

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  function tambahMotif(e) {
    e.preventDefault();
    if (!namaBaru.trim() || !daerahBaru.trim()) {
      tampilkanToast("Nama motif dan daerah asal wajib diisi.", "error");
      return;
    }
    const itemBaru = {
      id: namaBaru.toLowerCase().replace(/\s+/g, "-"),
      nama: namaBaru.trim(),
      daerah: daerahBaru.trim(),
      aliran: "Kurasi Admin",
      ciri: ciriBaru.trim() || `Motif batik tradisional khas ${daerahBaru.trim()}.`,
      pola: "pola-kawung",
    };
    setDaftarMotif([itemBaru, ...daftarMotif]);
    setNamaBaru("");
    setDaerahBaru("");
    setCiriBaru("");
    tampilkanToast(`${itemBaru.nama} ditambahkan ke daftar kelas.`);
  }

  function hapusFeedback(id) {
    const sisa = feedbackList.filter((f) => f.id !== id);
    setFeedbackList(sisa);
    localStorage.setItem("batikmatch_feedback_v1", JSON.stringify(sisa));
    tampilkanToast("Laporan feedback telah ditandai selesai.");
  }

  return (
    <div className="min-h-screen p-5 text-[#432912] sm:p-10">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Header Admin */}
        <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[30px] p-6">
          <div className="flex items-center gap-4">
            <BatikMatchLogo size={42} showTagline={false} />
            <div className="border-l border-[#432912]/15 pl-4">
              <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
                Panel Kurator &bull; {user?.email}
              </span>
              <h1 className="text-lg font-extrabold sm:text-xl">Dashboard Manajemen Wastra</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/studio"
              className="rounded-full border border-[#C59C8A]/60 bg-white/85 px-4 py-2 text-xs font-bold text-[#432912] hover:bg-white"
            >
              Buka Studio
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                nav("/");
              }}
              className="rounded-full bg-[#432912] px-4 py-2 text-xs font-bold text-white"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Kartu Ringkasan Statistik */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Total Kelas Dataset</span>
            <p className="mt-1 text-2xl font-extrabold text-[#432912]">{daftarMotif.length} Motif</p>
          </div>
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Umpan Balik Masuk</span>
            <p className="mt-1 text-2xl font-extrabold text-[#432912]">{feedbackList.length} Laporan</p>
          </div>
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Tingkat Kepuasan Prediksi</span>
            <p className="mt-1 text-2xl font-extrabold text-emerald-800">
              {feedbackList.length === 0
                ? "100%"
                : `${Math.round(
                    (feedbackList.filter((f) => f.status === "Akurat").length / feedbackList.length) * 100
                  )}%`}
            </p>
          </div>
        </div>

        {/* Switcher Tab Admin */}
        <div className="inline-flex rounded-full bg-[#D5D2CA]/60 p-1">
          <button
            type="button"
            onClick={() => setTab("dataset")}
            className={`rounded-full px-5 py-2 text-xs font-bold transition ${
              tab === "dataset" ? "bg-[#AD7559] text-white shadow-xs" : "text-[#432912]/70"
            }`}
          >
            Kelola Kelas Motif ({daftarMotif.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("feedback")}
            className={`rounded-full px-5 py-2 text-xs font-bold transition ${
              tab === "feedback" ? "bg-[#AD7559] text-white shadow-xs" : "text-[#432912]/70"
            }`}
          >
            Moderasi Feedback ({feedbackList.length})
          </button>
        </div>

        {tab === "dataset" ? (
          <>
            <form onSubmit={tambahMotif} className="glass-panel grid gap-3 rounded-[28px] p-5 sm:grid-cols-4">
              <input
                type="text"
                placeholder="Nama Motif (mis. Batik Nitik)"
                value={namaBaru}
                onChange={(e) => setNamaBaru(e.target.value)}
                className="rounded-2xl border border-[#C59C8A]/50 bg-white/85 px-4 py-2.5 text-xs font-medium focus:outline-none"
              />
              <input
                type="text"
                placeholder="Daerah Asal (mis. Yogyakarta)"
                value={daerahBaru}
                onChange={(e) => setDaerahBaru(e.target.value)}
                className="rounded-2xl border border-[#C59C8A]/50 bg-white/85 px-4 py-2.5 text-xs font-medium focus:outline-none"
              />
              <input
                type="text"
                placeholder="Ciri Visual Utama"
                value={ciriBaru}
                onChange={(e) => setCiriBaru(e.target.value)}
                className="rounded-2xl border border-[#C59C8A]/50 bg-white/85 px-4 py-2.5 text-xs font-medium focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#AD7559] py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-105"
              >
                + Tambah Kelas Motif
              </button>
            </form>

            <div className="glass-panel overflow-hidden rounded-[28px] p-6">
              <div className="divide-y divide-[#432912]/10">
                {daftarMotif.map((m) => (
                  <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#432912]">{m.nama}</p>
                        <span className="rounded-full bg-[#AD7559]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#85522F]">
                          {m.daerah}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#432912]/65">{m.ciri}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDaftarMotif(daftarMotif.filter((x) => x.id !== m.id));
                        tampilkanToast(`${m.nama} dihapus dari daftar.`);
                      }}
                      className="rounded-full bg-red-900/10 px-3.5 py-1.5 text-[11px] font-bold text-red-800 hover:bg-red-900/20"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="glass-panel rounded-[28px] p-6">
            <h2 className="text-base font-bold">Log Evaluasi Akurasi dari Pengguna</h2>
            <div className="mt-4 divide-y divide-[#432912]/10">
              {feedbackList.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#432912]/60">Belum ada laporan evaluasi baru.</p>
              ) : (
                feedbackList.map((f) => (
                  <div key={f.id} className="flex items-center justify-between gap-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          f.status === "Akurat"
                            ? "bg-emerald-700/15 text-emerald-900"
                            : "bg-amber-700/15 text-amber-900"
                        }`}
                      >
                        {f.status}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#432912]">{f.motif}</p>
                        <p className="text-[10px] text-[#432912]/55">Dikirim pukul {f.waktu}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => hapusFeedback(f.id)}
                      className="rounded-full border border-[#C59C8A]/60 bg-white/80 px-3.5 py-1 text-[11px] font-bold text-[#432912] hover:bg-[#AD7559] hover:text-white"
                    >
                      Tandai Selesai
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}