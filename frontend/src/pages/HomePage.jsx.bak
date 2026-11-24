import { useNavigate } from 'react-router-dom'
import UploadBox from '../components/UploadBox'
import CameraCapture from '../components/CameraCapture'
import PhotoTips from '../components/PhotoTips'
import { useSearch } from '../hooks/useSearch'
import { resizeImage } from '../utils/resizeImage'

export default function HomePage() {
  const navigate = useNavigate()
  const { search, loading, error } = useSearch()

  const handleFile = async (file) => {
    try {
      const resized = await resizeImage(file)
      const result = await search({ file: resized, topK: 5 })
      navigate('/hasil', { state: { result } })
    } catch {}
  }

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-batik-800">Kenali motif batik dari fotomu</h1>
        <p className="mt-2 text-batik-700/80">Foto atau unggah gambar batik — kami tebak motifnya dan tampilkan motif lain yang mirip.</p>
      </section>
      <UploadBox onFile={handleFile} disabled={loading} />
      <CameraCapture onCapture={handleFile} disabled={loading} />
      <PhotoTips />
      {loading && <p className="text-center text-sm text-batik-600">Menganalisis foto...</p>}
      {error && <p className="text-center text-sm text-rose-600">{error}</p>}
    </div>
  )
}
