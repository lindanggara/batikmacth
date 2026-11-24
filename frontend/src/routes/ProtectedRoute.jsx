import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { token } = useAuth()
  const location = useLocation()
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return <Outlet />
}
