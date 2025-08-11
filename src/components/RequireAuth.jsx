import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { Navigate, useLocation } from 'react-router-dom'

function RequireAuth({ children }) {
  const [user, loading] = useAuthState(auth)
  const location = useLocation()

  if (loading) return <p className="p-4">로딩 중...</p>
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return children
}

export default RequireAuth
