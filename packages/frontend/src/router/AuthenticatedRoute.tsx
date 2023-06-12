import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthenticatedRoute({ children }: { children: JSX.Element }) {
  const { getAuthenticatedUser, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getAuthenticatedUser().catch(() => {
      logout()
      navigate('/login')
    })
  }, [])

  return children
}
