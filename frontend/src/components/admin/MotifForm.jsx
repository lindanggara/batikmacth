import { useState } from 'react'

export default function MotifForm({ onSubmit, busy }) {
  const [nama, setNama] = useState('')
  const [daerah, setDaerah] = useState('')
  const [deskripsi, setDeskripsi] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!nama.trim()) return
    onSubmit({ nama: nama.trim(), daerah: daerah.trim(), deskripsi: deskripsi.trim() })
    setNama(''); setDaerah(''); setDeskripsi('')
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h3 className="font-semibold text-batik-800">Tambah motif</h3>
      <input className="input" placeholder="Nama motif" value={nama} onChange={(e) => setNama(e.target.value)} />
      <input className="input" placeholder="Daerah asal" value={daerah} onChange={(e) => setDaerah(e.target.value)} />
      <textarea className="input min-h-24" placeholder="Deskripsi singkat" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Menyimpan...' : 'Simpan motif'}</button>
    </form>
  )
}
