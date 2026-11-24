import { useEffect, useMemo, useState } from 'react'
import { listMotifs } from '../api/motifs'
import FilterBar from '../components/FilterBar'
import MotifCard from '../components/MotifCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

export default function ExplorePage() {
  const [motifs, setMotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [daerah, setDaerah] = useState('')

  useEffect(() => {
    setLoading(true)
    listMotifs().then(setMotifs).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const daftarDaerah = useMemo(() => [...new Set(motifs.map((m) => m.daerah))].sort(), [motifs])
  const filtered = daerah ? motifs.filter((m) => m.daerah === daerah) : motifs

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-batik-800">Jelajah motif</h1>
      <FilterBar value={daerah} onChange={setDaerah} options={daftarDaerah} />
      {loading && <Loader label="Memuat motif..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((m) => <MotifCard key={m.id} motif={m} />)}
        </div>
      )}
    </div>
  )
}
