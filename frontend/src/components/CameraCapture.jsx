import { useRef, useState } from 'react'

export default function CameraCapture({ onCapture, disabled }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [active, setActive] = useState(false)

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setActive(true)
    } catch {
      alert('Tidak bisa mengakses kamera. Coba izinkan akses kamera di browser.')
    }
  }

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setActive(false)
  }

  const snap = async () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      const file = new File([blob], 'kamera.jpg', { type: 'image/jpeg' })
      stop()
      onCapture(file)
    }, 'image/jpeg', 0.9)
  }

  return (
    <div className="card">
      {!active ? (
        <button type="button" className="btn-secondary w-full" onClick={start} disabled={disabled}>📷 Ambil dari Kamera</button>
      ) : (
        <div className="flex flex-col gap-3">
          <video ref={videoRef} className="w-full rounded-xl bg-black" playsInline muted />
          <div className="flex gap-2">
            <button type="button" className="btn-primary flex-1" onClick={snap}>Jepret</button>
            <button type="button" className="btn-secondary" onClick={stop}>Batal</button>
          </div>
        </div>
      )}
    </div>
  )
}
