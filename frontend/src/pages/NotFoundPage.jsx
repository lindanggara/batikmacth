import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="card text-center">
      <h1 className="text-3xl font-bold text-batik-800">404</h1>
      <p className="mt-2 text-batik-700">Halaman tidak ditemukan.</p>
      <Link to="/" className="btn-primary mt-4 inline-flex">Kembali ke Beranda</Link>
    </div>
  )
}
