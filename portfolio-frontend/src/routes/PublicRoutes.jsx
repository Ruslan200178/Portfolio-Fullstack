import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/ui/Loader'

// Prevents logged-in admin from seeing login page again
const PublicRoutes = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loader fullScreen />

  return isAuthenticated
    ? <Navigate to="/admin/dashboard" replace />
    : <Outlet />
}

export default PublicRoutes