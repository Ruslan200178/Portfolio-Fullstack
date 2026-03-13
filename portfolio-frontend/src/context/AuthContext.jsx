import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../api/services'

const AuthContext = createContext(null)

// Prefetch callback stored separately so AuthProvider can call DataContext
// without a circular dependency
let _prefetchAll = null
export const registerPrefetch = (fn) => { _prefetchAll = fn }

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // Restore session on app load
  useEffect(() => {
    const token = localStorage.getItem('portfolio_token')
    const saved = localStorage.getItem('portfolio_user')
    if (token && saved) {
      try { setUser(JSON.parse(saved)) } catch {
        localStorage.removeItem('portfolio_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      const res             = await authService.login({ email, password })
      const { token, user: userData } = res.data
      localStorage.setItem('portfolio_token', token)
      localStorage.setItem('portfolio_user',  JSON.stringify(userData))
      setUser(userData)

      // Prefetch all data immediately after login so pages load instantly
      if (_prefetchAll) _prefetchAll(true)

      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
      return { success: false, message }
    }
  }, [])

  const logout = useCallback(async () => {
    try { await authService.logout() } catch {}
    localStorage.removeItem('portfolio_token')
    localStorage.removeItem('portfolio_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      isAuthenticated: !!user,
      setError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext