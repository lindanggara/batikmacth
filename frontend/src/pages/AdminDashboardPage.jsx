import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { KATALOG } from "../data/katalogMotif";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BatikMatchLogo from "../components/BatikMatchLogo";
import {
  ambilKoleksi,
  ambilStatistik,
  ambilUmpanBalik,
  BackendMati,
  hapusMotif,
  SesiHabis,
  tambahFotoMotif,
  tambahMotif,
  tandaiUmpanBalikSelesai,
} from "../api/admin";

export default function AdminDashboardPage() {
  const nav = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { tampilkanToast } = useToast();
  const [tab, setTab] = useState("dataset");
  const [modeApi, setModeApi] = useState(true);
  const [memuat, setMemuat] = useState(true);

  const [stats, setStats] = useState({
    total_queries: 0,
    total_motifs: KATALOG.length,
    feedback_positif: 0,
    feedback_negatif: 0,
    pencarian_tidak_dikenal: 0,
  });

  const [daftarMotif, setDaftarMotif] = useState(KATALOG);
  const [namaBaru, setNamaBaru] = useState("");
  const [daerahBaru, setDaerahBaru] = useState("");
  const [ciriBaru, setCiriBaru] = useState("");
  const [uploadingId, setUploadingId] = useState(null);

  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    let batal = false;

    async function muatSemua() {
      setMemuat(true);
      try {
        const [st, kol, fb] = await Promise.all([
          ambilStatistik(),
          ambilKoleksi(),
          ambilUmpanBalik(),
        ]);
        if (batal) return;
        setModeApi(true);
        setStats(st);
        setDaftarMotif(kol);
        setFeedbackList(fb);
      } catch (err) {
        if (batal) return;
        if (err instanceof SesiHabis) {
          logout();
          tampilkanToast(err.message, "error");
          nav("/admin/login");
          return;
        }
        if (err instanceof BackendMati) {
          setModeApi(false);
          const lokalFb = JSON.parse(localStorage.getItem("batikmatch_feedback_v1") || "[]");
          setFeedbackList(
            lokalFb.map((x) => ({
              query_id: String(x.id),
              motif_nama: x.motif,
              cocok: x.status === "Akurat",
              created_at: x.waktu,
              skor: 0.92,
            }))
          );
        }
      } finally {
        if (!batal) setMemuat(false);
      }
    }

    muatSemua();
    return () => {
      batal = true;
    };
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  async function handleTambahMotif(e) {
    e.preventDefault();
    if (!namaBaru.trim() || !daerahBaru.trim()) {
      tampilkanToast("Nama motif dan daerah asal wajib diisi.", "error");
      return;
    }

    if (modeApi) {
      try {
        const baru = await tambahMotif({
          nama: namaBaru.trim(),
          daerah: daerahBaru.trim(),
          ciri: ciriBaru.trim() || `Motif batik tradisional khas ${daerahBaru.trim()}.`,
        });
        setDaftarMotif([baru, ...daftarMotif]);
        setStats((s) => ({ ...s, total_motifs: s.total_motifs + 1 }));
        setNamaBaru("");
        setDaerahBaru("");
        setCiriBaru("");
        tampilkanToast(`${baru.nama} berhasil disimpan ke server backend.`);
      } catch (err) {
        if (err instanceof SesiHabis) {
          logout();
          nav("/admin/login");
          return;
        }
        tampilkanToast(err.message, "error");
      }
    } else {
      const itemBaru = {
        id: namaBaru.toLowerCase().replace(/\s+/g, "-"),
        nama: namaBaru.trim(),
        daerah: daerahBaru.trim(),
        ciri: ciriBaru.trim() || `Motif batik tradisional khas ${daerahBaru.trim()}.`,
        tambahan: true,
      };
      setDaftarMotif([itemBaru, ...daftarMotif]);
      setNamaBaru("");
      setDaerahBaru("");
      setCiriBaru("");
      tampilkanToast(`${itemBaru.nama} ditambahkan (Mode Simulasi Lokal).`);
    }
  }

  async function handleUploadFotoReferensi(motifId, file) {
    if (!file) return;
    if (!modeApi) {
      tampilkanToast("Nyalakan server backend untuk mengunggah gambar referensi galeri.", "error");
      return;
    }
    setUploadingId(motifId);
    try {
      const updated = await tambahFotoMotif(motifId, file);
      setDaftarMotif((prev) => prev.map((m) => (m.id === motifId ? updated : m)));
      tampilkanToast(`Foto ditambahkan ke ${updated.nama}! Siap dikenali tanpa retrain.`);
    } catch (err) {
      if (err instanceof SesiHabis) {
        logout();
        nav("/admin/login");
        return;
      }
      tampilkanToast(err.message, "error");
    } finally {
      setUploadingId(null);
    }
  }

  async function handleHapusMotif(motif) {
    if (modeApi) {
      try {
        await hapusMotif(motif.id);
        setDaftarMotif(daftarMotif.filter((x) => x.id !== motif.id));
        setStats((s) => ({ ...s, total_motifs: Math.max(0, s.total_motifs - 1) }));
        tampilkanToast(`${motif.nama} dihapus dari server.`);
      } catch (err) {
        if (err instanceof SesiHabis) {
          logout();
          nav("/admin/login");
          return;
        }
        tampilkanToast(err.message, "error");
      }
    } else {
      setDaftarMotif(daftarMotif.filter((x) => x.id !== motif.id));
      tampilkanToast(`${motif.nama} dihapus (Mode Lokal).`);
    }
  }

  async function handleSelesaiFeedback(queryId) {
    if (modeApi) {
      try {
        await tandaiUmpanBalikSelesai(queryId);
        setFeedbackList((prev) => prev.filter((f) => f.query_id !== queryId));
        tampilkanToast("Laporan feedback ditandai selesai ditinjau.");
      } catch (err) {
        if (err instanceof SesiHabis) {
          logout();
          nav("/admin/login");
          return;
        }
        tampilkanToast(err.message, "error");
      }
    } else {
      const sisa = feedbackList.filter((f) => f.query_id !== queryId);
      setFeedbackList(sisa);
      tampilkanToast("Feedback dihapus dari daftar lokal.");
    }
  }

  return (
    <div className="min-h-screen p-5 text-[#432912] sm:p-10">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Header Admin */}
        <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-[30px] p-6">
          <div className="flex items-center gap-4">
            <BatikMatchLogo size={42} showTagline={false} />
            <div className="border-l border-[#432912]/15 pl-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#AD7559] uppercase">
                  Panel Kurator &bull; {user?.email || user?.nama}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    modeApi ? "bg-emerald-700/15 text-emerald-900" : "bg-amber-700/15 text-amber-900"
                  }`}
                >
                  {modeApi ? "Terhubung Backend" : "Mode Offline"}
                </span>
              </div>
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Total Kelas</span>
            <p className="mt-1 text-2xl font-extrabold text-[#432912]">{daftarMotif.length}</p>
          </div>
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Total Pindai</span>
            <p className="mt-1 text-2xl font-extrabold text-[#432912]">{stats.total_queries}</p>
          </div>
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Feedback Akurat</span>
            <p className="mt-1 text-2xl font-extrabold text-emerald-800">{stats.feedback_positif}</p>
          </div>
          <div className="glass-latte rounded-2xl p-5">
            <span className="text-[10px] font-bold tracking-wider text-[#85522F] uppercase">Tidak Dikenal</span>
            <p className="mt-1 text-2xl font-extrabold text-amber-800">{stats.pencarian_tidak_dikenal}</p>
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
            Kelola Kelas &amp; Galeri ({daftarMotif.length})
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

        {memuat ? (
          <div className="glass-panel rounded-[28px] p-10 text-center text-xs font-bold text-[#85522F]">
            Memuat data dari server BatikMatch...
          </div>
        ) : tab === "dataset" ? (
          <>
            <form onSubmit={handleTambahMotif} className="glass-panel grid gap-3 rounded-[28px] p-5 sm:grid-cols-4">
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
                + Tambah Kelas Baru
              </button>
            </form>

            <div className="glass-panel overflow-hidden rounded-[28px] p-6">
              <div className="divide-y divide-[#432912]/10">
                {daftarMotif.map((m) => (
                  <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-[#432912]">{m.nama}</p>
                        <span className="rounded-full bg-[#AD7559]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#85522F]">
                          {m.daerah}
                        </span>
                        {typeof m.jumlah_gambar === "number" && (
                          <span className="rounded-full bg-[#432912]/10 px-2 py-0.5 text-[10px] font-semibold text-[#432912]/75">
                            {m.jumlah_gambar} foto galeri
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-[#432912]/65">{m.ciri}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Unggah Foto Referensi Tanpa Retrain */}
                      <label className="cursor-pointer rounded-full border border-[#C59C8A]/70 bg-white/85 px-3.5 py-1.5 text-[11px] font-bold text-[#432912] transition hover:bg-[#AD7559] hover:text-white">
                        {uploadingId === m.id ? "Mengunggah..." : "+ Foto Referensi"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingId === m.id}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            handleUploadFotoReferensi(m.id, f);
                          }}
                        />
                      </label>

                      {(m.tambahan || !modeApi) && (
                        <button
                          type="button"
                          onClick={() => handleHapusMotif(m)}
                          className="rounded-full bg-red-900/10 px-3.5 py-1.5 text-[11px] font-bold text-red-800 hover:bg-red-900/20"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
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
                <p className="py-6 text-center text-xs text-[#432912]/60">
                  Semua laporan evaluasi sudah ditinjau.
                </p>
              ) : (
                feedbackList.map((f) => (
                  <div key={f.query_id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                          f.cocok
                            ? "bg-emerald-700/15 text-emerald-900"
                            : "bg-amber-700/15 text-amber-900"
                        }`}
                      >
                        {f.cocok ? "Akurat" : "Kurang Tepat"}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#432912]">
                          {f.motif_nama || f.motif_id || "Hasil Pencarian"}{" "}
                          {typeof f.skor === "number" && `(${Math.round(f.skor * 100)}%)`}
                        </p>
                        <p className="text-[10px] text-[#432912]/55">
                          ID: {f.query_id?.slice(0, 8)} &bull; {f.created_at || "Baru saja"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelesaiFeedback(f.query_id)}
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