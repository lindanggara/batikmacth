import { apiRequest } from './client'
import { MOCK_MOTIFS } from './mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export async function loginAdmin({ username, password }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500))
    if (username === 'admin' && password === 'admin') {
      return { token: 'mock-token-' + Date.now(), username: 'admin' }
    }
    throw new Error('Username atau password salah.')
  }
  return apiRequest('/admin/login', { method: 'POST', body: { username, password } })
}

export async function getStats() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return { total_queries: 128, total_motifs: MOCK_MOTIFS.length, feedback_positif: 94, feedback_negatif: 34 }
  }
  return apiRequest('/admin/stats')
}

export async function listCollection() {
  if (USE_MOCK) { await new Promise((r) => setTimeout(r, 200)); return MOCK_MOTIFS }
  return apiRequest('/admin/motifs')
}

export async function createMotif(payload) {
  if (USE_MOCK) { await new Promise((r) => setTimeout(r, 300)); return { ok: true } }
  return apiRequest('/admin/motifs', { method: 'POST', body: payload })
}
