export function skorLabel(skor) {
  if (skor >= 0.85) return 'Sangat mirip'
  if (skor >= 0.7) return 'Mirip'
  if (skor >= 0.55) return 'Cukup mirip'
  return 'Sedikit mirip'
}
export function confidenceLabel(conf) {
  if (conf >= 0.8) return 'Yakin'
  if (conf >= 0.5) return 'Cukup yakin'
  return 'Kurang yakin'
}
export function persen(x) { return `${Math.round(x * 100)}%` }
