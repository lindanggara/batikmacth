export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="card border-rose-200 bg-rose-50 text-rose-800">
      <p className="font-medium">Terjadi kesalahan</p>
      <p className="text-sm">{message}</p>
    </div>
  )
}
