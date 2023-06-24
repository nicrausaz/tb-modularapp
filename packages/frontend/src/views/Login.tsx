import { CheckIcon } from '@/assets/icons'
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
        <div className="text-center lg:text-left flex-row lg:flex gap-6">
          <div>
            <span className="text-5xl font-bold flex items-center gap-2 text-center">
              <img className="mask w-14" src="/api/box/static/logo.svg" />
              {t('login.title')}
            </span>

            <p className="py-6">{t('login.subtitle')}</p>

            <div className="flex-row">
              <span className="flex items-center gap-2 my-2">
                <CheckIcon className="w-5 h-5" />
                Add & configure your modules
              </span>
              <span className="flex items-center gap-2 my-2">
                <CheckIcon className="w-5 h-5" />
                Make great dashboards to visualize your data
              </span>
              <span className="flex items-center gap-2 my-2">
                <CheckIcon className="w-5 h-5" />
                Configure users and permissions
              </span>
              <span className="flex items-center gap-2 my-2">
                <CheckIcon className="w-5 h-5" />
                Personalize your box your way
              </span>
            </div>
          </div>
        </div>
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
