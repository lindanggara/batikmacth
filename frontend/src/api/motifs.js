import { apiRequest } from './client'
import { MOCK_MOTIFS } from './mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export async function listMotifs({ daerah } = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return daerah ? MOCK_MOTIFS.filter((m) => m.daerah === daerah) : MOCK_MOTIFS
  }
  const qs = daerah ? `?daerah=${encodeURIComponent(daerah)}` : ''
  return apiRequest(`/motifs${qs}`)
}

export async function getMotif(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150))
    const m = MOCK_MOTIFS.find((x) => x.id === id)
    if (!m) throw new Error('Motif tidak ditemukan')
    return m
  }
  return apiRequest(`/motifs/${id}`)
}
