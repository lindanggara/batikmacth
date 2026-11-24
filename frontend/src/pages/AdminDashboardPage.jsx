import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getStats } from '../api/admin'
import StatsChart from '../components/admin/StatsChart'
import Loader from '../components/Loader'
import { useAuth } from '../hooks/useAuth'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { getStats().then(setStats).finally(() => setLoading(false)) }, [])
  const keluar = () => { logout(); navigate('/admin/login', { replace: true }) }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-batik-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="font-bold text-batik-800">Admin · BatikLens</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-batik-700">Halo, {username || 'admin'}</span>
            <button onClick={keluar} className="text-rose-600 underline">Keluar</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-bold text-batik-800">Dasbor</h1>
        {loading && <Loader />}
        {stats && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="card"><p className="text-xs text-batik-700/70">Total pencarian</p><p className="text-2xl font-bold">{stats.total_queries}</p></div>
              <div className="card"><p className="text-xs text-batik-700/70">Total motif</p><p className="text-2xl font-bold">{stats.total_motifs}</p></div>
              <div className="card"><p className="text-xs text-batik-700/70">Umpan balik</p><p className="text-2xl font-bold">{stats.feedback_positif + stats.feedback_negatif}</p></div>
            </div>
            <StatsChart stats={stats} />
            <div className="flex gap-2">
              <Link to="/admin/koleksi" className="btn-primary">Kelola koleksi</Link>
              <Link to="/" className="btn-secondary">Lihat situs</Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
