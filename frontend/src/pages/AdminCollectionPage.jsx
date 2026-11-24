import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCollection, createMotif } from '../api/admin'
import MotifForm from '../components/admin/MotifForm'
import DuplicateWarning from '../components/admin/DuplicateWarning'
import Loader from '../components/Loader'

export default function AdminCollectionPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [dupes, setDupes] = useState([])

  const reload = () => { setLoading(true); listCollection().then(setItems).finally(() => setLoading(false)) }
  useEffect(() => { reload() }, [])

  const handleCreate = async (payload) => {
    setBusy(true); setDupes([])
    try {
      const similar = items
        .filter((m) => m.nama.toLowerCase().includes(payload.nama.toLowerCase()))
        .map((m) => ({ ...m, skor: 0.9 }))
      if (similar.length) setDupes(similar)
      await createMotif(payload)
      reload()
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-batik-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="text-sm text-batik-700 underline">â† Dasbor</Link>
          <span className="font-bold text-batik-800">Kelola koleksi</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <MotifForm onSubmit={handleCreate} busy={busy} />
        <DuplicateWarning matches={dupes} />
        <h2 className="font-semibold text-batik-800">Daftar motif</h2>
        {loading ? <Loader /> : (
          <div className="card divide-y divide-batik-100 p-0">
            {items.map((m) => (
              <div key={m.id} className="flex justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-batik-800">{m.nama}</p>
                  <p className="text-xs text-batik-700/70">{m.daerah}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
