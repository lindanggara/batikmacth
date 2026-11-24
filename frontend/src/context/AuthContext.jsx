import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('batiklens_admin_token'))
  const [username, setUsername] = useState(() => localStorage.getItem('batiklens_admin_user') || '')

  const login = (newToken, user) => {
    localStorage.setItem('batiklens_admin_token', newToken)
    localStorage.setItem('batiklens_admin_user', user)
    setToken(newToken)
    setUsername(user)
  }

  const logout = () => {
    localStorage.removeItem('batiklens_admin_token')
    localStorage.removeItem('batiklens_admin_user')
    setToken(null)
    setUsername('')
  }

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
