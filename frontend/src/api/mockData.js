export const MOCK_MOTIFS = [
  { id: 'parang', nama: 'Parang', daerah: 'Jawa Tengah', deskripsi: 'Motif parang berupa jalinan miring seperti huruf S yang saling terkait. Melambangkan kesinambungan dan kekuatan.' },
  { id: 'kawung', nama: 'Kawung', daerah: 'Yogyakarta', deskripsi: 'Motif kawung berupa empat lingkaran yang tersusun dari pola geometris, melambangkan kesempurnaan.' },
  { id: 'megamendung', nama: 'Megamendung', daerah: 'Cirebon', deskripsi: 'Motif awan bergelombang dengan warna cerah, mencerminkan kepemimpinan yang bijak.' },
  { id: 'truntum', nama: 'Truntum', daerah: 'Solo', deskripsi: 'Motif bunga kecil-kecil yang berserakan seperti bintang, melambangkan cinta yang tumbuh kembali.' },
  { id: 'sogan', nama: 'Sogan', daerah: 'Yogyakarta', deskripsi: 'Ciri warna cokelat khas batik klasik, sering dipakai sebagai latar motif lain.' },
  { id: 'sidomukti', nama: 'Sidomukti', daerah: 'Solo', deskripsi: 'Motif yang melambangkan kemakmuran dan kebahagiaan, sering dipakai di acara pernikahan.' },
  { id: 'ceplok', nama: 'Ceplok', daerah: 'Jawa', deskripsi: 'Pola geometris simetris dengan variasi bunga dan bintang di dalamnya.' },
  { id: 'tujuh-rupi', nama: 'Tujuh Rupi', daerah: 'Bengkulu', deskripsi: 'Motif khas Bengkulu dengan pola berulang menyerupai koin.' },
]

export const MOCK_SEARCH_RESULT = {
  query_id: 'mock-' + Date.now(),
  terdeteksi: { label: 'Parang', confidence: 0.87 },
  mirip: [
    { id: 'parang', nama: 'Parang', daerah: 'Jawa Tengah', skor: 0.94 },
    { id: 'kawung', nama: 'Kawung', daerah: 'Yogyakarta', skor: 0.81 },
    { id: 'ceplok', nama: 'Ceplok', daerah: 'Jawa', skor: 0.74 },
    { id: 'truntum', nama: 'Truntum', daerah: 'Solo', skor: 0.69 },
    { id: 'sidomukti', nama: 'Sidomukti', daerah: 'Solo', skor: 0.63 },
  ],
  belumDikenal: false,
}
