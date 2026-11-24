import MotifCard from './MotifCard'
import { skorLabel } from '../utils/formatScore'

export default function SimilarGallery({ items }) {
  if (!items?.length) return null
  return (
    <section className="space-y-3">
      <h3 className="font-semibold text-batik-800">Motif yang mirip</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((m) => (
          <div key={m.id} className="space-y-1">
            <MotifCard motif={m} skor={m.skor} />
            <p className="px-2 text-xs text-batik-600">{skorLabel(m.skor)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
