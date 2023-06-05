import { useEffect, useState } from 'react'
import { useFetchAuth } from '@/hooks/useFetch'
import { getAuthenticatedUser } from '../api/api'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Home() {
  const { authenticatedUser } = useAuth()
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    setUsername(authenticatedUser.username)
  }, [])

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="hero h-1/2 overflow-hidden">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Welcome back {username} !</h1>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Number of active modules</div>
                <div className="stat-value">3</div>
                <div className="stat-desc">Of 6 imported</div>
              </div>
            </div>
            <Link className="btn btn-primary" to={'/dashboard'}>Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
