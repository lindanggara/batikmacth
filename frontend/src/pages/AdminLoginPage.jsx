import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { loginAdmin } from '../api/admin'
import { useAuth } from '../hooks/useAuth'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError(null)
    try {
      const data = await loginAdmin({ username, password })
      login(data.token, data.username || username)
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-3">
        <h1 className="text-xl font-bold text-batik-800">Login Admin</h1>
        <p className="text-xs text-batik-700/70">Mode demo: admin / admin</p>
        <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Masuk...' : 'Masuk'}</button>
        <Link to="/" className="block text-center text-xs text-batik-600 underline">â† Kembali</Link>
      </form>
    </div>
  )
}
