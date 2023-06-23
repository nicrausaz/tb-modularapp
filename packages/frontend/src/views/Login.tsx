import ToastContainer from '@/components/ToastContainer'
import LoginForm from '@/components/login/LoginForm'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { tError } = useToast()

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  const handleSubmit = (username: string, password: string) => {
    login(username, password)
      .then(() => navigate('/'))
      .catch((err) => tError('Error', err.message))
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <ToastContainer />
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <img className="mask w-28 md:w-40 mx-auto" src="/api/box/static/logo.svg" />
          <h1 className="text-5xl font-bold pt-4">{t('login.title')}</h1>
          <p className="py-6">{t('login.subtitle')}</p>
        </div>
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
