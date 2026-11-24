const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(path, { method = 'GET', body, headers = {}, isForm = false } = {}) {
  const token = localStorage.getItem('batiklens_admin_token')
  const finalHeaders = { ...headers }
  if (token) finalHeaders.Authorization = `Bearer ${token}`
  if (!isForm && body) finalHeaders['Content-Type'] = 'application/json'

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let msg = `Permintaan gagal (${res.status})`
    try { const data = await res.json(); msg = data.detail || data.message || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}
