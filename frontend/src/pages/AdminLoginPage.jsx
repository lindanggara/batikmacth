import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BatikMatchLogo, { BatikMatchMascot } from "../components/BatikMatchLogo";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const { login, loginAdmin } = useAuth();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("admin");
  const [sandi, setSandi] = useState("");
  const [lihatSandi, setLihatSandi] = useState(false);
  const [pesan, setPesan] = useState("");
  const [memproses, setMemproses] = useState(false);

  async function handleMasuk(e) {
    e.preventDefault();
    if (!email.trim() || !sandi.trim()) {
      setPesan(role === "admin" ? "Username dan kata sandi wajib diisi." : "Email dan kata sandi wajib diisi.");
      return;
    }
    if (role !== "admin") {
      login({ email: email.trim() });
      nav("/");
      return;
    }
    setPesan("");
    setMemproses(true);
    try {
      await loginAdmin({ username: email.trim(), password: sandi });
      nav("/admin");
    } catch (err) {
      setPesan(err.message || "Gagal masuk. Coba lagi.");
    } finally {
      setMemproses(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F3EAE0] via-[#E8DACB] to-[#DFCBB8] p-4 text-[#2D1A0B] sm:p-6">
      {/* Ornamen Cahaya Ambient Melayang di Belakang Kaca */}
      <div className="animate-float-card pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#AD7559]/25 blur-3xl" />
      <div className="animate-float-card pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-[#432912]/20 blur-3xl" />
      {/* Kartu Utama Split-Screen Modern */}
      <div className="glass-card-motion relative z-10 grid w-full max-w-[960px] grid-cols-1 rounded-[34px] md:grid-cols-[1.04fr_1fr]">
        {/* PANEL KIRI: Kartu Visual Solid Berwarna & Ilustrasi Wastra AI */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#5A341B] via-[#432612] to-[#281508] p-7 text-white sm:p-9">
          {/* Dekorasi Cahaya Halus di Sudut */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#AD7559]/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#D7B89C]/15 blur-2xl" />

          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold text-white/90 backdrop-blur-xs transition hover:bg-white/20"
            >
              <span>&larr;</span>
              <span>Kembali ke Beranda</span>
            </Link>

            <h2 className="mt-7 font-serif text-2xl font-extrabold leading-snug tracking-tight sm:text-[28px]">
              Kelola &amp; Jelajahi Wastra Nusantara
            </h2>
            <p className="mt-2.5 text-xs leading-relaxed text-[#E5D3C4]/85 sm:text-[13px]">
              Sederhanakan kurasi dataset 15 kelas motif batik atau simpan riwayat pemindaian AI pribadi dalam satu ruang kerja terpadu.
            </p>
          </div>

          {/* Ilustrasi Visual Tengah: Foto Pengrajin Membatik */}
          <div className="relative z-10 my-5 space-y-3">
            <div className="animate-float-card group relative h-[215px] w-full overflow-hidden rounded-[22px] border border-white/20 bg-[#2B170A] shadow-[0_14px_30px_rgba(0,0,0,0.3)]">
              <img
                src="/login-membatik.jpg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/motif/kawung.jpg";
                }}
                alt="Pengrajin sedang membatik tulis dengan canting"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient hangat agar menyatu dengan kartu cokelat sogan */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(40,21,8,0.12) 0%, rgba(40,21,8,0.2) 55%, rgba(28,14,5,0.88) 100%)",
                }}
              />
              <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-0.5 text-[10px] font-bold text-[#DFB8A4] backdrop-blur-xs">
                Warisan Budaya Takbenda
              </span>
              <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between text-white">
                <div>
                  <p className="font-serif text-xs font-bold">Seni Membatik Nusantara</p>
                  <p className="text-[10px] text-white/75">Preservasi digital berbasis Computer Vision</p>
                </div>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-2.5 text-left">
              <div className="rounded-2xl border border-white/25 bg-white/12 px-3.5 py-2.5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20">
                <span className="block text-[10px] font-bold text-[#DFB8A4] uppercase">Dataset Bersih</span>
                <span className="text-xs font-extrabold text-white">1.326 Citra • 15 Kelas</span>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/12 px-3.5 py-2.5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20">
                <span className="block text-[10px] font-bold text-[#DFB8A4] uppercase">Performa CBIR</span>
                <span className="text-xs font-extrabold text-white">P@5 82.5% • mAP 73.1%</span>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-[11px] font-medium text-white/60">
            BatikMatch &bull; Studio Pengenalan &amp; Ensiklopedia Batik
          </p>
        </div>

        {/* PANEL KANAN: Formulir Login Bersih & Modern */}
        <div className="relative flex flex-col justify-center px-6 py-9 sm:px-11">
          {/* Aksen Blur Halus di Pojok Kanan Atas Persis Referensi */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-[#AD7559]/15 blur-2xl" />

          {/* Logo Brand */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#432912] text-white shadow-xs">
                <BatikMatchMascot size={24} />
              </div>
              <span className="font-serif text-lg font-extrabold text-[#2D1A0B]">BatikMatch</span>
            </div>

            <h1 className="mt-5 font-serif text-2xl font-extrabold text-[#2D1A0B]">
              Selamat Datang Kembali
            </h1>
            <p className="mt-1 text-xs text-[#7D6450]">
              Silakan masuk sesuai peran akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Pemilih Peran (Admin / Kurator vs Kolektor) */}
          <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-2xl border border-[#E5D7CA] bg-[#EFE6DC] p-1">
            {[
              { id: "admin", label: "Admin / Kurator" },
              { id: "user", label: "Kolektor (User)" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setRole(r.id);
                  setEmail(r.id === "admin" ? "admin" : "kolektor@batikmatch.id");
                  setSandi("");
                  setPesan("");
                }}
                className={`rounded-xl py-2 text-xs font-bold transition ${
                  role === r.id
                    ? "bg-[#432912] text-white shadow-xs"
                    : "text-[#6E5440] hover:text-[#2D1A0B]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleMasuk} className="mt-5 space-y-3.5">
            <div>
              <label htmlFor="akun" className="mb-1 block text-[11px] font-bold text-[#432912]">
                {role === "admin" ? "Username Admin" : "Email Kolektor"}
              </label>
              <input
                id="akun"
                type={role === "admin" ? "text" : "email"}
                autoComplete="username"
                placeholder={role === "admin" ? "Masukkan username admin" : "nama@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#DFD1C3] bg-white px-4 py-3 text-xs font-semibold text-[#2D1A0B] placeholder:text-[#A38E7C] focus:border-[#AD7559] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="sandi" className="mb-1 block text-[11px] font-bold text-[#432912]">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="sandi"
                  type={lihatSandi ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  value={sandi}
                  onChange={(e) => setSandi(e.target.value)}
                  className="w-full rounded-xl border border-[#DFD1C3] bg-white px-4 py-3 pr-10 text-xs font-semibold text-[#2D1A0B] placeholder:text-[#A38E7C] focus:border-[#AD7559] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setLihatSandi((v) => !v)}
                  aria-label={lihatSandi ? "Sembunyikan sandi" : "Lihat sandi"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8C705A] hover:text-[#2D1A0B]"
                >
                  {lihatSandi ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#8C705A]">
                <span>{role === "admin" ? "Konfigurasi via backend/.env" : "Tersimpan lokal di browser"}</span>
                <Link to="/tentang" className="font-semibold text-[#AD7559] hover:underline">
                  Bantuan Akses
                </Link>
              </div>
            </div>

            {pesan && (
              <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                {pesan}
              </p>
            )}

            <button
              type="submit"
              disabled={memproses}
              className="w-full rounded-xl bg-[#AD7559] py-3 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(173,117,89,0.32)] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
            >
              {memproses ? "Memeriksa Kredensial..." : role === "admin" ? "Masuk ke Panel Admin" : "Masuk sebagai Kolektor"}
            </button>
          </form>

          {/* Pemisah & Opsi Akses Cepat Tanpa Login (Persis Bagian Bawah Referensi) */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5D7CA]" />
            <span className="text-[11px] font-medium text-[#8C705A]">atau lanjutkan sebagai tamu</span>
            <div className="h-px flex-1 bg-[#E5D7CA]" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/studio"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#DFD1C3] bg-white py-2.5 text-xs font-bold text-[#2D1A0B] transition hover:border-[#AD7559] hover:text-[#AD7559]"
            >
              <span>Studio Pindai</span>
            </Link>
            <Link
              to="/jelajah"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#DFD1C3] bg-white py-2.5 text-xs font-bold text-[#2D1A0B] transition hover:border-[#AD7559] hover:text-[#AD7559]"
            >
              <span>15 Katalog Motif</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}