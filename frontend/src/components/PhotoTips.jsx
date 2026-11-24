const tips = [
  'Gunakan pencahayaan alami, hindari bayangan keras.',
  'Foto dari jarak dekat, fokus pada satu area motif.',
  'Usahakan kain tidak terlipat.',
  'Hindari latar belakang yang ramai.',
]

export default function PhotoTips() {
  return (
    <div className="card">
      <h3 className="mb-2 font-semibold text-batik-800">Tips Foto</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-batik-700/90">
        {tips.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  )
}
