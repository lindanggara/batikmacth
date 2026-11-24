export default function Loader({ label = 'Memproses...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-batik-700">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-batik-300 border-t-batik-600" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
