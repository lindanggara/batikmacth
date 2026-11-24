export default function ConfidenceBadge({ value }) {
  const color = value >= 0.8 ? 'bg-emerald-100 text-emerald-800'
              : value >= 0.5 ? 'bg-amber-100 text-amber-800'
              : 'bg-rose-100 text-rose-800'
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {Math.round(value * 100)}%
    </span>
  )
}
