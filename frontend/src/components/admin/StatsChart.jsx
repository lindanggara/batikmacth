export default function StatsChart({ stats }) {
  const total = stats.feedback_positif + stats.feedback_negatif || 1
  const pct = Math.round((stats.feedback_positif / total) * 100)
  return (
    <div className="card space-y-2">
      <h3 className="font-semibold text-batik-800">Kepuasan pengguna</h3>
      <div className="h-3 w-full overflow-hidden rounded-full bg-batik-100">
        <div className="h-full bg-batik-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-batik-700">{pct}% umpan balik positif ({stats.feedback_positif}/{total})</p>
    </div>
  )
}
