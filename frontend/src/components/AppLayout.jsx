import { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import BatikMatchLogo, { BatikMatchMascot } from "./BatikMatchLogo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { KATALOG } from "../data/katalogMotif";
import { cekStatusBackend } from "../api/client";

const IKON = {
  landing: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  scan: "M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2M9 12h6M12 9v6",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  compare: "M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M12 2v20",
  history: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  heart: "M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z",
  info: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5M12 8v.01",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  more: "M4 6h16M4 12h16M4 18h16",
};

const MENU = [
  { to: "/studio", label: "Studio Pindai", d: IKON.scan },
  { to: "/jelajah", label: "Katalog Motif", d: IKON.grid },
  { to: "/bandingkan", label: "Bandingkan Motif", d: IKON.compare },
  { to: "/riwayat", label: "Riwayat Pindai", d: IKON.history },
  { to: "/favorit", label: "Koleksi Favorit", d: IKON.heart },
  { to: "/tentang", label: "Tentang Sistem", d: IKON.info },
];

const JUDUL_RUTE = {
  "/": "Beranda Utama",
  "/studio": "Studio Pemindaian AI",
  "/jelajah": "Katalog 15 Motif Batik",
  "/bandingkan": "Bandingkan Motif",
  "/riwayat": "Riwayat Pemindaian",
  "/favorit": "Koleksi Favorit",
  "/tentang": "Tentang Sistem & Dataset",
  "/hasil": "Hasil Identifikasi Motif",
};

function Ikon({ d, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d={d} />
    </svg>
  );
}

export default function AppLayout({ children }) {
  const nav = useNavigate();
  const { user, role, isAdmin, logout } = useAuth();
  const { tampilkanToast } = useToast();
  const { pathname } = useLocation();
  const [statusApi, setStatusApi] = useState("simulasi");
  const [menuAkunBuka, setMenuAkunBuka] = useState(false);
  const [drawerMobileBuka, setDrawerMobileBuka] = useState(false);

  const [sidebarTutup, setSidebarTutup] = useState(() => {
    try {
      return localStorage.getItem("batikmatch_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    cekStatusBackend().then(setStatusApi);
  }, []);

  useEffect(() => {
    setMenuAkunBuka(false);
    setDrawerMobileBuka(false);
  }, [pathname]);

  function toggleSidebar() {
    setSidebarTutup((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("batikmatch_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  }

  function handleLogout() {
    logout();
    setMenuAkunBuka(false);
    tampilkanToast("Berhasil keluar dari akun.");
    nav("/");
  }

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen text-[#432912] selection:bg-[#AD7559]/30">
      <aside
        className={`glass-panel sticky top-0 z-30 hidden h-screen shrink-0 flex-col justify-between border-r border-white/60 transition-all duration-300 ease-out lg:flex ${
          sidebarTutup ? "w-[84px] px-3 py-5" : "w-64 p-5"
        }`}
      >
        <div>
          <div className={`flex items-center ${sidebarTutup ? "flex-col gap-3" : "justify-between px-1"}`}>
            <Link to="/" title="BatikMatch Beranda">
              {sidebarTutup ? <BatikMatchMascot size={40} /> : <BatikMatchLogo size={40} />}
            </Link>

            <button
              type="button"
              onClick={toggleSidebar}
              title={sidebarTutup ? "Buka Sidebar (Ctrl+B)" : "Tutup Sidebar (Ctrl+B)"}
              aria-label={sidebarTutup ? "Buka Sidebar" : "Tutup Sidebar"}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#C59C8A]/50 bg-white/75 text-xs font-bold text-[#432912] shadow-2xs transition hover:bg-[#AD7559] hover:text-white"
            >
              {sidebarTutup ? "»" : "«"}
            </button>
          </div>

          <nav aria-label="Menu dashboard" className="mt-6 space-y-1">
            {!sidebarTutup && (
              <p className="px-3 pb-1.5 text-[10px] font-bold tracking-widest text-[#432912]/40 uppercase">
                Navigasi
              </p>
            )}
            {MENU.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.end}
                title={sidebarTutup ? m.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-2xl py-2.5 text-xs font-bold transition-all ${
                    sidebarTutup ? "justify-center px-0" : "gap-3 px-4"
                  } ${
                    isActive
                      ? "bg-[#AD7559] text-white shadow-[0_8px_20px_rgba(173,117,89,0.28)]"
                      : "text-[#432912]/70 hover:bg-white/65 hover:text-[#432912]"
                  }`
                }
              >
                <Ikon d={m.d} />
                {!sidebarTutup && <span className="truncate">{m.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          {sidebarTutup ? (
            <Link
              to="/studio"
              title="Pindai Foto Baru"
              className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#AD7559] text-base font-bold text-white shadow-sm transition hover:brightness-105"
            >
              +
            </Link>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-[#85522F] to-[#432912] p-4 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-[#C59C8A] uppercase">
                  Model CNN
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Siap
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold leading-snug text-[#F3F1ED]">
                {KATALOG.length} Kelas Motif Batik Nusantara
              </p>
              <Link
                to="/studio"
                className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#AD7559] py-2 text-xs font-bold text-white transition hover:brightness-105"
              >
                + Pindai Foto Baru
              </Link>
            </div>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              title="Keluar dari Akun"
              className={`flex w-full items-center rounded-xl py-2 text-xs font-semibold text-red-900/80 transition hover:bg-red-900/10 ${
                sidebarTutup ? "justify-center px-0" : "justify-between px-3"
              }`}
            >
              <span className="flex items-center gap-2">
                <Ikon d={IKON.user} size={16} />
                {!sidebarTutup && <span>Keluar ({role.toUpperCase()})</span>}
              </span>
              {!sidebarTutup && <span className="text-[10px] font-bold">⎋</span>}
            </button>
          ) : (
            <Link
              to="/admin/login"
              title="Masuk / Panel Admin"
              className={`flex items-center rounded-xl py-2 text-xs font-semibold text-[#432912]/70 transition hover:bg-white/60 hover:text-[#432912] ${
                sidebarTutup ? "justify-center px-0" : "justify-between px-3"
              }`}
            >
              <span className="flex items-center gap-2">
                <Ikon d={IKON.user} size={16} />
                {!sidebarTutup && <span className="truncate">Masuk Akun</span>}
              </span>
              {!sidebarTutup && (
                <span className="rounded-full bg-[#AD7559]/15 px-2 py-0.5 text-[9px] font-bold text-[#85522F] uppercase">
                  GUEST
                </span>
              )}
            </Link>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-white/50 bg-[#F3F1ED]/75 px-5 py-3 backdrop-blur-xl lg:px-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSidebar}
                title="Buka / Tutup Sidebar (Ctrl+B)"
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[#C59C8A]/50 bg-white/80 text-[#432912] transition hover:bg-[#AD7559] hover:text-white lg:flex"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M9 3v18" />
                </svg>
              </button>

              <Link to="/" className="lg:hidden">
                <BatikMatchLogo size={34} showTagline={false} />
              </Link>

              <div className="hidden sm:block">
                <p className="text-xs font-extrabold text-[#432912]">
                  {JUDUL_RUTE[pathname] || "BatikMatch Studio"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="hidden items-center gap-1.5 rounded-full border border-[#C59C8A]/50 bg-white/80 px-3 py-1.5 text-[10px] font-bold text-[#432912]/80 md:inline-flex">
                <span className={`h-2 w-2 rounded-full ${statusApi === "online" ? "bg-emerald-500" : "bg-amber-500"}`} />
                {statusApi === "online" ? "API Server Aktif" : "Mode Simulasi Lokal"}
              </span>

              {pathname !== "/studio" && (
                <Link
                  to="/studio"
                  className="rounded-full bg-[#AD7559] px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:brightness-105"
                >
                  + Pindai Foto
                </Link>
              )}

              <div className="relative">
                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMenuAkunBuka((b) => !b)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#C59C8A]/65 bg-white/85 px-3.5 py-2 text-xs font-bold text-[#432912] transition hover:bg-white"
                    >
                      <span>{user.nama}</span>
                      <span className="rounded-full bg-[#AD7559]/15 px-1.5 py-0.5 text-[9px] text-[#85522F]">
                        {role.toUpperCase()}
                      </span>
                      <span className="text-[10px]">▾</span>
                    </button>

                    {menuAkunBuka && (
                      <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/80 bg-[#F3F1ED]/95 p-2 shadow-xl backdrop-blur-xl">
                        <div className="border-b border-[#432912]/10 px-3 py-2">
                          <p className="truncate text-xs font-bold text-[#432912]">{user.nama}</p>
                          <p className="truncate text-[10px] text-[#432912]/60">{user.email}</p>
                        </div>
                        <div className="mt-1 space-y-1">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="block rounded-xl px-3 py-2 text-xs font-bold text-[#432912] hover:bg-white"
                            >
                              Panel Kurator Admin
                            </Link>
                          )}
                          <Link
                            to="/favorit"
                            className="block rounded-xl px-3 py-2 text-xs font-bold text-[#432912] hover:bg-white"
                          >
                            Koleksi Favorit Saya
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full rounded-xl px-3 py-2 text-left text-xs font-bold text-red-800 hover:bg-red-900/10"
                          >
                            Keluar Akun
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    className="rounded-full border border-[#C59C8A]/65 bg-white/85 px-3.5 py-2 text-xs font-bold text-[#432912] transition hover:bg-white"
                  >
                    Masuk
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-28 pt-6 lg:px-10 lg:pb-14 lg:pt-8">
          {children ?? <Outlet />}
        </main>
      </div>

      {drawerMobileBuka && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end bg-[#2B170A]/60 backdrop-blur-xs lg:hidden">
          <div className="rounded-t-[30px] border-t border-white/80 bg-[#F3F1ED] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <BatikMatchLogo size={34} showTagline={false} />
              <button
                type="button"
                onClick={() => setDrawerMobileBuka(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#432912]/10 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {MENU.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  end={m.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-xs font-bold ${
                      isActive
                        ? "bg-[#AD7559] text-white"
                        : "bg-white/80 text-[#432912]"
                    }`
                  }
                >
                  <Ikon d={m.d} size={16} />
                  <span>{m.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-4 border-t border-[#432912]/10 pt-4">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full bg-red-900/10 py-2.5 text-xs font-bold text-red-800"
                >
                  Keluar dari {user.nama} ({role.toUpperCase()})
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex w-full items-center justify-center rounded-full bg-[#432912] py-2.5 text-xs font-bold text-white"
                >
                  Masuk sebagai Kolektor / Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Menu bawah"
        className="glass-panel fixed inset-x-0 bottom-0 z-30 flex h-[66px] items-center justify-around px-2 lg:hidden"
      >
        {MENU.slice(1, 5).map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            aria-label={m.label}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 transition-colors ${
                isActive ? "text-[#AD7559]" : "text-[#432912]/45 hover:text-[#432912]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Ikon d={m.d} size={20} />
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                    isActive ? "bg-[#AD7559] opacity-100" : "opacity-0"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => setDrawerMobileBuka((b) => !b)}
          aria-label="Semua Menu"
          className="flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 text-[#432912]/60 hover:text-[#AD7559]"
        >
          <Ikon d={IKON.more} size={20} />
          <span className="h-1.5 w-1.5 rounded-full opacity-0" />
        </button>
      </nav>
    </div>
  );
}