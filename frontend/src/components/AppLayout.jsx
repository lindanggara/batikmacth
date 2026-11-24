import { NavLink, Link, Outlet } from "react-router-dom";

const IKON = {
  home: "M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  compare: "M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M12 2v20",
  history: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  heart: "M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z",
  info: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5M12 8v.01",
  admin: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
};

const MENU = [
  { to: "/", label: "Beranda", end: true, d: IKON.home },
  { to: "/jelajah", label: "Katalog Motif", d: IKON.grid },
  { to: "/bandingkan", label: "Bandingkan Motif", d: IKON.compare },
  { to: "/riwayat", label: "Riwayat Pindai", d: IKON.history },
  { to: "/favorit", label: "Koleksi Favorit", d: IKON.heart },
  { to: "/tentang", label: "Tentang Sistem", d: IKON.info },
];

function Ikon({ d, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen text-[#432912] selection:bg-[#AD7559]/30">
      {/* SIDEBAR KIRI DASHBOARD */}
      <aside className="glass-panel sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-white/60 p-6 lg:flex">
        <div>
          <Link to="/" className="flex items-center gap-3 px-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#85522F] to-[#432912] text-sm font-bold text-[#F3F1ED] shadow-sm">
              ✦
            </span>
            <div>
              <span className="block text-base font-bold leading-tight text-[#432912]">
                BatikLens
              </span>
              <span className="block text-[11px] font-medium text-[#85522F]">
                Wastra AI Studio
              </span>
            </div>
          </Link>

          <nav aria-label="Menu dashboard" className="mt-7 space-y-1">
            <p className="px-3 pb-1.5 text-[10px] font-bold tracking-widest text-[#432912]/40 uppercase">
              Navigasi
            </p>
            {MENU.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#AD7559] text-white shadow-[0_8px_20px_rgba(173,117,89,0.28)]"
                      : "text-[#432912]/70 hover:bg-white/60 hover:text-[#432912]"
                  }`
                }
              >
                <Ikon d={m.d} />
                <span>{m.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-[#85522F] to-[#432912] p-4 text-white shadow-sm">
            <span className="text-[10px] font-bold tracking-wider text-[#C59C8A] uppercase">
              Model Klasifikasi
            </span>
            <p className="mt-1 text-xs font-semibold leading-snug text-[#F3F1ED]">
              Arsitektur CNN &bull; 8 Motif Batik Klasik
            </p>
            <Link
              to="/"
              className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#AD7559] py-2 text-xs font-bold text-white transition hover:brightness-105"
            >
              + Pindai Foto Baru
            </Link>
          </div>

          <Link
            to="/admin/login"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#432912]/55 transition hover:bg-white/50 hover:text-[#432912]"
          >
            <Ikon d={IKON.admin} size={16} />
            <span>Panel Admin</span>
          </Link>
        </div>
      </aside>

      {/* KONTEN UTAMA KANAN */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-28 pt-6 lg:px-10 lg:pb-14 lg:pt-8">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* MENU BAWAH HP (< 1024px) */}
      <nav
        aria-label="Menu bawah"
        className="glass-panel fixed inset-x-0 bottom-0 z-20 flex h-[66px] items-center justify-around px-3 lg:hidden"
      >
        {MENU.slice(0, 5).map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            end={m.end}
            aria-label={m.label}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 transition-colors ${
                isActive ? "text-[#AD7559]" : "text-[#432912]/40 hover:text-[#432912]"
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
      </nav>
    </div>
  );
}