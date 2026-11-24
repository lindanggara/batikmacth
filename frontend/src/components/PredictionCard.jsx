import { confidenceLabel, persen } from '../utils/formatScore'

export default function PredictionCard({ terdeteksi, belumDikenal }) {
  if (belumDikenal) {
    return (
      <div className="card border-amber-200 bg-amber-50">
        <h3 className="font-semibold text-amber-800">Motif belum dikenal</h3>
        <p className="mt-1 text-sm text-amber-700">Kemungkinan motif ini belum ada di basis data. Coba foto dari sudut lain, atau jelajahi motif serupa di bawah.</p>
      </div>
    )
  }
  if (!terdeteksi) return null
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-batik-500">Tebakan motif</p>
          <h2 className="text-2xl font-bold text-batik-800">{terdeteksi.label}</h2>
        </div>
        <span className="rounded-full bg-batik-100 px-3 py-1 text-xs font-semibold text-batik-700">
          {confidenceLabel(terdeteksi.confidence)} · {persen(terdeteksi.confidence)}
        </span>
      </div>
    </div>
  )
}
