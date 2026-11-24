import { useState } from 'react'
import { sendFeedback } from '../api/search'

export default function FeedbackButtons({ queryId }) {
  const [sent, setSent] = useState(null)
  const [busy, setBusy] = useState(false)

  const send = async (cocok) => {
    setBusy(true)
    try { await sendFeedback({ queryId, cocok }); setSent(cocok) }
    catch { alert('Gagal mengirim umpan balik. Coba lagi nanti.') }
    finally { setBusy(false) }
  }

  if (sent !== null) {
    return <div className="card text-center text-sm text-batik-700">Terima kasih! Umpan balik kamu membantu kami.</div>
  }
  return (
    <div className="card">
      <p className="mb-3 text-sm font-medium text-batik-800">Apakah hasil ini cocok dengan fotomu?</p>
      <div className="flex gap-2">
        <button disabled={busy} className="btn-primary flex-1" onClick={() => send(true)}>👍 Ya</button>
        <button disabled={busy} className="btn-secondary flex-1" onClick={() => send(false)}>👎 Tidak</button>
      </div>
    </div>
  )
}
