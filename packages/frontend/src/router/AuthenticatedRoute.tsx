import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AuthenticatedRoute({ children }: { children: JSX.Element }) {
  const { authenticatedUser } = useAuth()

  if (!authenticatedUser) {
    return <Navigate to="/login" />
  }
  return children
}
