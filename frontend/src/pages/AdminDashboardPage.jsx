import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BatikMatchLogo from "../components/BatikMatchLogo";
import {
  BackendMati,
  SesiHabis,
  ambilKoleksi,
  ambilStatistik,
  ambilUmpanBalik,
  hapusMotif,
  tambahFotoMotif,
  tambahMotif as tambahMotifApi,
  tandaiUmpanBalikSelesai,
} from "../api/admin";

function formatWaktu(iso) {
  try {
    return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function AdminDashboardPage() {
  const nav = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { tampilkanToast } = useToast();
  const [tab, setTab] = useState("dataset");
  const [daftarMotif, setDaftarMotif] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [statistik, setStatistik] = useState(null);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");
  const [namaBaru, setNamaBaru] = useState("");
  const [daerahBaru, setDaerahBaru] = useState("");
  const [ciriBaru, setCiriBaru] = useState("");
  const [sibuk, setSibuk] = useState(false);

  // Semua error dari API lewat sini: sesi habis -> keluar, sisanya tampilkan pesan.
  const tanganiGalat = useCallback(
    (err) => {
      if (err instanceof SesiHabis) {
        logout();
        tampilkanToast("Sesi admin habis. Silakan masuk lagi.", "error");
        nav("/admin/login", { replace: true });
        return;
      }
      tampilkanToast(err.message || "Terjadi kesalahan.", "error");
    },
    [logout, nav, tampilkanToast]
  );

  const muatData = useCallback(async () => {
    setMemuat(true);
    setGalat("");
    try {
      const [stat, motif, umpan] = await Promise.all([ambilStatistik(), ambilKoleksi(), ambilUmpanBalik()]);
      setStatistik(stat);
      setDaftarMotif(motif);
      setFeedbackList(umpan);
    } catch (err) {
      if (err instanceof BackendMati) setGalat(err.message);
      else tanganiGalat(err);
    } finally {
      setMemuat(false);
    }
  }, [tanganiGalat]);

  useEffect(() => {
    if (isAdmin) muatData();
  }, [isAdmin, muatData]);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  async function tambahMotif(e) {
    e.preventDefault();
    if (!namaBaru.trim() || !daerahBaru.trim()) {
      tampilkanToast("Nama motif dan daerah asal wajib diisi.", "error");
      return;
    }
    setSibuk(true);
    try {
      const baru = await tambahMotifApi({ nama: namaBaru.trim(), daerah: daerahBaru.trim(), ciri: ciriBaru.trim() });
      setNamaBaru("");
      setDaerahBaru("");
      setCiriBaru("");
      tampilkanToast(`${baru.nama} ditambahkan. Unggah foto supaya motif ini bisa dicari.`);
      await muatData();
    } catch (err) {
      tanganiGalat(err);
    } finally {
      setSibuk(false);
    }
  }

  async function hapus(m) {
    if (!window.confirm(`Hapus ${m.nama} beserta semua fotonya?`)) return;
    try {
      await hapusMotif(m.id);
      tampilkanToast(`${m.nama} dihapus dari koleksi.`);
      await muatData();
    } catch (err) {
      tanganiGalat(err);
    }
  }

  async function unggahFoto(m, file) {
    if (!file) return;
    try {
      await tambahFotoMotif(m.id, file);
      tampilkanToast(`Foto ditambahkan ke ${m.nama}. Motif langsung bisa dicari tanpa melatih ulang model.`);
      await muatData();
    } catch (err) {
      tanganiGalat(err);
    }
  }

  async function hapusFeedback(queryId) {
    try {
      await tandaiUmpanBalikSelesai(queryId);
      setFeedbackList((daftar) => daftar.filter((f) => f.query_id !== queryId));
      tampilkanToast("Laporan feedback telah ditandai selesai.");
    } catch (err) {
      tanganiGalat(err);
    }
  }

  const totalUmpanBalik = statistik ? statistik.feedback_positif + statistik.feedback_negatif : 0;
  const kepuasan = totalUmpanBalik ? Math.round((statistik.feedback_positif / totalUmpanBalik) * 100) : null;

  return (
    <div className="min-h-screen p-5 text-[#432912] sm:p-10">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Header Admin */}
        <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[30px] p-6">
          <div className="flex items-center gap-4">
            <BatikMatchLogo size={42} showTagline={false} />
            <div className="border-l border-[#432912]/15 pl-4">
              <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
                Panel Kurator &bull; {user?.username || user?.email}
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

        {galat && (
          <div role="alert" className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-red-300/60 p-5">
            <p className="text-sm font-bold text-red-800">{galat}</p>
            <button
              type="button"
              onClick={muatData}
              className="rounded-full bg-[#AD7559] px-4 py-2 text-xs font-bold text-white"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Kartu Ringkasan Statistik (dari GET /admin/stats) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Total Kelas Dataset</span>
            <p className="mt-1 text-2xl font-extrabold text-[#432912]">{memuat ? "…" : `${daftarMotif.length} Motif`}</p>
          </div>
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Total Pencarian</span>
            <p className="mt-1 text-2xl font-extrabold text-[#432912]">{statistik ? statistik.total_queries : "…"}</p>
            {statistik && (
              <p className="mt-0.5 text-[10px] font-semibold text-[#432912]/55">
                {statistik.pencarian_tidak_dikenal} tidak dikenal
              </p>
            )}
          </div>
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Umpan Balik Masuk</span>
            <p className="mt-1 text-2xl font-extrabold text-[#432912]">{statistik ? `${totalUmpanBalik} Laporan` : "…"}</p>
          </div>
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Tingkat Kepuasan Prediksi</span>
            <p className="mt-1 text-2xl font-extrabold text-emerald-800">{kepuasan === null ? "–" : `${kepuasan}%`}</p>
            {statistik && (
              <p className="mt-0.5 text-[10px] font-semibold text-[#432912]/55">
                {statistik.feedback_positif} akurat &bull; {statistik.feedback_negatif} kurang tepat
              </p>
            )}
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
                disabled={sibuk}
                className="rounded-full bg-[#AD7559] py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-105 disabled:opacity-60"
              >
                {sibuk ? "Menyimpan..." : "+ Tambah Kelas Motif"}
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
                        <span className="text-[10px] font-semibold text-[#432912]/50">{m.jumlah_gambar} foto</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#432912]/65">{m.ciri || "Belum ada deskripsi ciri visual."}</p>
                    </div>
                    {m.tambahan ? (
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer rounded-full border border-[#C59C8A]/60 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold text-[#432912] hover:bg-[#AD7559] hover:text-white">
                          + Foto
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="sr-only"
                            onChange={(e) => {
                              unggahFoto(m, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => hapus(m)}
                          className="rounded-full bg-red-900/10 px-3.5 py-1.5 text-[11px] font-bold text-red-800 hover:bg-red-900/20"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <span className="rounded-full bg-[#432912]/8 px-3 py-1 text-[10px] font-bold text-[#432912]/55">
                        Kelas dataset
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="glass-panel rounded-[28px] p-6">
            <h2 className="text-base font-bold">Log Evaluasi Akurasi dari Pengguna</h2>
            <div className="mt-4 divide-y divide-[#432912]/10">
              {memuat ? (
                <p className="py-6 text-center text-xs text-[#432912]/60">Memuat…</p>
              ) : feedbackList.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#432912]/60">Belum ada laporan evaluasi baru.</p>
              ) : (
                feedbackList.map((f) => (
                  <div key={f.query_id} className="flex items-center justify-between gap-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          f.cocok ? "bg-emerald-700/15 text-emerald-900" : "bg-amber-700/15 text-amber-900"
                        }`}
                      >
                        {f.cocok ? "Akurat" : "Kurang Tepat"}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#432912]">
                          {f.motif_nama || "Tidak ada tebakan"}
                          {typeof f.skor === "number" && (
                            <span className="ml-1.5 font-semibold text-[#432912]/55">
                              ({Math.round(f.skor * 100)}%{f.yakin ? "" : ", tidak dikenal"})
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-[#432912]/55">
                          {formatWaktu(f.created_at)} &bull; model {f.model}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => hapusFeedback(f.query_id)}
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