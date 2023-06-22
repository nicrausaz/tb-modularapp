import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Home() {
  const { authenticatedUser } = useAuth()
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    setUsername(authenticatedUser?.username || '')
  }, [authenticatedUser])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="hero h-1/2 overflow-hidden">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">Welcome back {username} !</h1>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Number of active modules</div>
                <div className="stat-value">-</div>
                <div className="stat-desc">Of - imported</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="w-full px-10">
        <div className="grid grid-cols-3 text-center gap-6">
          <Link className="card bg-primary text-primary-content" to={'/dashboard'}>
            <div className="card-body">
              <h2 className="card-title">Configure your visualization screens</h2>
              <p className="text-sm">Customize multiple display to fit your needs</p>
            </div>
          </Link>
          <Link className="card bg-primary text-primary-content" to={'/modules'}>
            <div className="card-body">
              <h2 className="card-title">Manage your modules</h2>
              <p className="text-sm">Add and customize integrations </p>
            </div>
          </Link>
          <Link className="card bg-primary text-primary-content" to={'/settings'}>
            <div className="card-body">
              <h2 className="card-title">Personalize your box</h2>
              <p className="text-sm">Adapt the box to your usage</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
