import { NavLink, Outlet } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Cari' },
  { to: '/jelajah', label: 'Jelajah' },
  { to: '/favorit', label: 'Favorit' },
  { to: '/tentang', label: 'Tentang' },
]

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 border-b border-batik-100 bg-batik-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-batik-700">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-batik-500 text-white">B</span>
            BatikLens
          </NavLink>
          <nav className="flex gap-1 text-sm">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 font-medium transition ${isActive ? 'bg-batik-500 text-white' : 'text-batik-700 hover:bg-batik-100'}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-batik-100 py-6 text-center text-xs text-batik-700/70">
        BatikLens · Tugas Neuro Computing · <NavLink to="/admin/login" className="underline">Admin</NavLink>
      </footer>
    </div>
  )
}
