import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMotifs } from '../api/motifs'
import { useFavorites } from '../hooks/useFavorites'
import MotifCard from '../components/MotifCard'
import Loader from '../components/Loader'

export default function FavoritesPage() {
  const { ids } = useFavorites()
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { listMotifs().then(setAll).finally(() => setLoading(false)) }, [])
  const favorites = all.filter((m) => ids.includes(m.id))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-batik-800">Favorit</h1>
      {loading && <Loader label="Memuat favorit..." />}
      {!loading && favorites.length === 0 && (
        <div className="card text-center text-batik-700">
          Belum ada favorit. Tekan ikon hati pada motif untuk menyimpannya.{' '}
          <Link to="/jelajah" className="underline">Jelajah motif</Link>
        </div>
      )}
      {!loading && favorites.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {favorites.map((m) => <MotifCard key={m.id} motif={m} />)}
        </div>
      )}
    </div>
  )
}
