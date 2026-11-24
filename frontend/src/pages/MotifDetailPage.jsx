import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMotif } from '../api/motifs'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { useFavorites } from '../hooks/useFavorites'

export default function MotifDetailPage() {
  const { id } = useParams()
  const [motif, setMotif] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isFavorite, toggle } = useFavorites()

  useEffect(() => {
    setLoading(true)
    getMotif(id).then(setMotif).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader label="Memuat detail motif..." />
  if (error) return <ErrorMessage message={error} />
  if (!motif) return null
  const fav = isFavorite(motif.id)

  return (
    <div className="space-y-4">
      <Link to="/jelajah" className="text-sm text-batik-600 underline">← Kembali ke jelajah</Link>
      <div className="card space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-batik-800">{motif.nama}</h1>
            <p className="text-sm text-batik-700/70">{motif.daerah}</p>
          </div>
          <button onClick={() => toggle(motif.id)} className="text-3xl">{fav ? '❤️' : '🤍'}</button>
        </div>
        <p className="text-batik-800/90">{motif.deskripsi}</p>
      </div>
    </div>
  )
}
