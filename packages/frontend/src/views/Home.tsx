import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { authenticatedUser } = useAuth()
  const [username, setUsername] = useState<string>('')
  const { t } = useTranslation()

  useEffect(() => {
    setUsername(authenticatedUser?.username || '')
  }, [authenticatedUser])

  return (
    <div className="flex flex-col h-full w-full pb-20">
      <div className="hero h-96 bg-gradient-to-r from-primary to-accent shadow-inner py-10 mb-10">
        <div className="hero-content flex-col lg:flex-row-reverse justify-between gap-10 backdrop-blur-xl bg-white/30 shadow-xl rounded-xl">
          <h1 className="text-5xl font-bold ">
            {`${t('home.subtitle')} `}
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {username}
            </span>
            {` !`}
          </h1>
        </div>
      </div>
      <div className="w-full px-10">
        <div className="flex flex-col sm:grid grid-cols-3 text-center gap-6">
          <Link
            className="card bg-primary text-primary-content hover:shadow-lg hover:shadow-primary transition-shadow"
            to={'/dashboard'}
          >
            <div className="card-body">
              <h2 className="card-title">{t('home.call_to_action.dashboard')}</h2>
              <p className="text-sm">{t('home.call_to_action.dashboard_subtitle')}</p>
            </div>
          </Link>
          <Link className="card bg-primary text-primary-content hover:shadow-lg hover:shadow-primary transition-shadow" to={'/modules'}>
            <div className="card-body">
              <h2 className="card-title">{t('home.call_to_action.modules')}</h2>
              <p className="text-sm">{t('home.call_to_action.modules_subtitle')}</p>
            </div>
          </Link>
          <Link className="card bg-primary text-primary-content hover:shadow-lg hover:shadow-primary transition-shadow" to={'/settings'}>
            <div className="card-body">
              <h2 className="card-title">{t('home.call_to_action.box')}</h2>
              <p className="text-sm">{t('home.call_to_action.box')}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
