import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

export default function AuthenticatedRoute({ children }: { children: JSX.Element }) {
  const { authenticatedUser, getAuthenticatedUser, logout } = useAuth()

  useEffect(() => {
    getAuthenticatedUser()
      .catch(() => logout())
  }, [])

  if (!authenticatedUser) {
    return <Navigate to="/login" />
  }
  return children
}
