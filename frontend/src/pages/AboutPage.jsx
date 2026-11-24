export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-batik-800">Tentang BatikLens</h1>
      <div className="card space-y-3 text-batik-800/90">
        <p>BatikLens adalah aplikasi web untuk mengenali motif batik dari foto, lalu menampilkan motif lain yang mirip. Dibuat sebagai tugas Praktikum Neuro Computing.</p>
        <p>Metode: CNN pretrained + fine-tuning, ekstraksi embedding, dan cosine similarity untuk pencarian kemiripan.</p>
        <p className="text-sm text-batik-700/70">Keterbatasan: hanya mencakup 15 motif; tebakan bisa meleset pada motif yang mirip.</p>
      </div>
    </div>
  )
}
