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
    <div className="flex flex-col h-full w-full pb-20">
      <div className="hero h-96 bg-gradient-to-r from-primary to-accent shadow-inner py-10 mb-10">
        <div className="hero-content flex-col lg:flex-row-reverse justify-between gap-10 backdrop-blur-xl bg-white/30 shadow-xl rounded-xl">
          <h1 className="text-5xl font-bold ">
            Welcome back{' '}
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {username}
            </span>{' '}
            !
          </h1>
        </div>
      </div>
      {/* <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Number of active modules</div>
                <div className="stat-value">-</div>
                <div className="stat-desc">Of - imported</div>
              </div>
            </div> */}

      <div className="w-full px-10">
        <div className="flex flex-col sm:grid grid-cols-3 text-center gap-6">
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
