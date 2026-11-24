import { apiRequest } from './client'
import { MOCK_SEARCH_RESULT } from './mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export async function searchByImage({ file, topK = 5, daerah = '' }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 900))
    if (!file) throw new Error('File gambar tidak ditemukan.')
    if (!file.type?.startsWith('image/')) throw new Error('File harus berupa gambar.')
    return { ...MOCK_SEARCH_RESULT, query_id: 'mock-' + Date.now() }
  }
  const fd = new FormData()
  fd.append('file', file)
  fd.append('top_k', String(topK))
  if (daerah) fd.append('daerah', daerah)
  return apiRequest('/search', { method: 'POST', body: fd, isForm: true })
}

export async function sendFeedback({ queryId, cocok }) {
  if (USE_MOCK) { await new Promise((r) => setTimeout(r, 300)); return { ok: true } }
  return apiRequest('/feedback', { method: 'POST', body: { query_id: queryId, cocok } })
}
