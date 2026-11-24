export default function DuplicateWarning({ matches = [] }) {
  if (!matches.length) return null
  return (
    <div className="card border-amber-200 bg-amber-50 text-amber-800">
      <p className="font-medium">Kemungkinan duplikat</p>
      <p className="text-sm">Motif berikut mirip dengan yang sudah ada:</p>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {matches.map((m) => <li key={m.id}>{m.nama} ({Math.round(m.skor * 100)}% mirip)</li>)}
      </ul>
    </div>
  )
}
