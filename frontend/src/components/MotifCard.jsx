import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

export default function MotifCard({ motif, skor }) {
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(motif.id)
  return (
    <div className="card flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Link to={`/motif/${motif.id}`} className="block truncate font-semibold text-batik-800 hover:underline">{motif.nama}</Link>
        <p className="text-xs text-batik-700/70">{motif.daerah}</p>
        {typeof skor === 'number' && (
          <p className="mt-1 text-xs text-batik-600">Kemiripan {Math.round(skor * 100)}%</p>
        )}
      </div>
      <button onClick={() => toggle(motif.id)} className="text-2xl leading-none" title={fav ? 'Hapus dari favorit' : 'Simpan ke favorit'}>
        {fav ? '❤️' : '🤍'}
      </button>
    </div>
  )
}
