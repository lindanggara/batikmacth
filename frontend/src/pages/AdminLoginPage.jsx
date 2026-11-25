import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const { login, loginAdmin } = useAuth();
  const [role, setRole] = useState("admin");
  // Admin: username dari backend/.env (ADMIN_USERNAME). Kolektor: email, hanya disimpan di browser.
  const [email, setEmail] = useState("admin");
  const [sandi, setSandi] = useState("");
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
    <div className="flex min-h-screen items-center justify-center p-5 text-[#432912]">
      <div className="glass-panel w-full max-w-md rounded-[32px] p-8">
        <Link to="/" className="text-xs font-bold text-[#AD7559] hover:underline">
          &larr; Kembali ke Beranda
        </Link>

        <div className="mt-5">
          <span className="text-[10px] font-bold tracking-widest text-[#85522F] uppercase">
            Autentikasi Multi-Role
          </span>
          <h1 className="mt-1 text-2xl font-bold">Masuk ke BatikMatch</h1>
          <p className="mt-1 text-xs text-[#432912]/65">
            Pilih peran akses untuk mengelola dataset wastra atau menyinkronkan koleksi pribadi.
          </p>
        </div>

        {/* Pemilih Role (Admin vs Kolektor/User) */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-[#D5D2CA]/60 p-1">
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
              className={`rounded-full py-2 text-xs font-bold transition ${
                role === r.id
                  ? "bg-[#AD7559] text-white shadow-sm"
                  : "text-[#432912]/65 hover:text-[#432912]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleMasuk} className="mt-5 space-y-4">
          <div>
            <label htmlFor="akun" className="block text-xs font-bold text-[#432912]">
              {role === "admin" ? "Username Admin" : "Email Akun"}
            </label>
            <input
              id="akun"
              type={role === "admin" ? "text" : "email"}
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[#C59C8A]/60 bg-white/80 px-4 py-2.5 text-xs font-medium focus:border-[#AD7559] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="sandi" className="block text-xs font-bold text-[#432912]">Kata Sandi</label>
            <input
              id="sandi"
              type="password"
              autoComplete="current-password"
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[#C59C8A]/60 bg-white/80 px-4 py-2.5 text-xs font-medium focus:border-[#AD7559] focus:outline-none"
            />
          </div>

          {pesan && <p role="alert" className="text-xs font-semibold text-red-700">{pesan}</p>}

          <button
            type="submit"
            disabled={memproses}
            className="w-full rounded-full bg-[#AD7559] py-3 text-xs font-bold text-white shadow-md transition hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
          >
            {memproses ? "Memeriksa..." : role === "admin" ? "Masuk ke Panel Admin" : "Masuk sebagai Kolektor"}
          </button>

          {role === "admin" ? (
            <p className="text-center text-[11px] text-[#432912]/55">
              Akun admin diatur di file <code>backend/.env</code> (ADMIN_USERNAME dan ADMIN_PASSWORD).
            </p>
          ) : (
            <p className="text-center text-[11px] text-[#432912]/55">
              Akun kolektor hanya disimpan di browser ini untuk favorit dan riwayat.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}