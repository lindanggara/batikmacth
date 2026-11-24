export default function FilterBar({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onChange('')}
        className={`rounded-full px-3 py-1.5 text-sm font-medium ${value === '' ? 'bg-batik-500 text-white' : 'bg-white text-batik-700 ring-1 ring-batik-200'}`}>Semua</button>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${value === o ? 'bg-batik-500 text-white' : 'bg-white text-batik-700 ring-1 ring-batik-200'}`}>{o}</button>
      ))}
    </div>
  )
}
