import { useLocation, Link } from 'react-router-dom'
import PredictionCard from '../components/PredictionCard'
import SimilarGallery from '../components/SimilarGallery'
import FeedbackButtons from '../components/FeedbackButtons'

export default function ResultPage() {
  const { state } = useLocation()
  const result = state?.result

  if (!result) {
    return (
      <div className="card text-center">
        <p className="text-batik-700">Belum ada hasil. Silakan unggah foto terlebih dahulu.</p>
        <Link to="/" className="btn-primary mt-4 inline-flex">Kembali ke Beranda</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PredictionCard terdeteksi={result.terdeteksi} belumDikenal={result.belumDikenal} />
      <SimilarGallery items={result.mirip} />
      <FeedbackButtons queryId={result.query_id} />
      <div className="text-center">
        <Link to="/" className="text-sm text-batik-600 underline">Cari foto lain</Link>
      </div>
    </div>
  )
}
