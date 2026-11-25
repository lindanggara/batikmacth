import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("kurator@batikmatch.id");
  const [sandi, setSandi] = useState("admin123");
  const [pesan, setPesan] = useState("");

  function handleMasuk(e) {
    e.preventDefault();
    if (!email.trim() || !sandi.trim()) {
      setPesan("Email dan kata sandi wajib diisi.");
      return;
    }
    login({ email: email.trim(), role });
    nav(role === "admin" ? "/admin" : "/");
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
                setEmail(r.id === "admin" ? "kurator@batikmatch.id" : "kolektor@batikmatch.id");
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
            <label className="block text-xs font-bold text-[#432912]">Email Akun</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[#C59C8A]/60 bg-white/80 px-4 py-2.5 text-xs font-medium focus:border-[#AD7559] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#432912]">Kata Sandi</label>
            <input
              type="password"
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-[#C59C8A]/60 bg-white/80 px-4 py-2.5 text-xs font-medium focus:border-[#AD7559] focus:outline-none"
            />
          </div>

          {pesan && <p className="text-xs font-semibold text-red-700">{pesan}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-[#AD7559] py-3 text-xs font-bold text-white shadow-md transition hover:brightness-105"
          >
            {role === "admin" ? "Masuk ke Panel Admin" : "Masuk sebagai Kolektor"}
          </button>
        </form>
      </div>
    </div>
  );
}