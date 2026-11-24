import { useRef, useState } from 'react'

export default function UploadBox({ onFile, disabled }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('File harus berupa gambar (JPG, PNG, dll).'); return }
    if (file.size > 10 * 1024 * 1024) { alert('Ukuran file terlalu besar. Maksimum 10 MB.'); return }
    onFile(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]) }}
      className={`card flex flex-col items-center justify-center gap-4 py-10 text-center transition ${drag ? 'ring-2 ring-batik-500' : ''}`}>
      <div className="text-5xl">🖼️</div>
      <p className="text-batik-700">Tarik foto batik ke sini, atau</p>
      <button type="button" className="btn-primary" onClick={() => inputRef.current?.click()} disabled={disabled}>Pilih Foto</button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      <p className="text-xs text-batik-700/70">JPG/PNG, maks 10 MB. Foto jelas, pencahayaan cukup.</p>
    </div>
  )
}
