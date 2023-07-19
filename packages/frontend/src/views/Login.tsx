import { CheckIcon } from '@/assets/icons'
import ToastContainer from '@/components/ToastContainer'
import LoginForm from '@/components/login/LoginForm'
import { useAuth } from '@/contexts/AuthContext'
import { BoxProvider, useBox } from '@/contexts/BoxContext'
import { useToast } from '@/contexts/ToastContext'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Image from '@/components/Image'

export default function Login() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { tError } = useToast()
  const { box } = useBox()

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
      <BoxProvider>
        <ToastContainer />
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left flex-row lg:flex gap-6">
            <div>
              <div className="text-4xl font-bold flex items-center gap-3 text-center">
                <Image
                  src={`/api/box/static/${box?.icon}`}
                  fallback="/assets/logo.svg"
                  alt="module_icon"
                  className="w-14"
                />
                {box?.name}
              </div>

              <p className="py-6">{t('login.subtitle')}</p>

              <div className="flex-row">
                <span className="flex items-center gap-2 my-2">
                  <CheckIcon className="w-5 h-5" />
                  {t('login.features.key_1')}
                </span>
                <span className="flex items-center gap-2 my-2">
                  <CheckIcon className="w-5 h-5" />
                  {t('login.features.key_2')}
                </span>
                <span className="flex items-center gap-2 my-2">
                  <CheckIcon className="w-5 h-5" />
                  {t('login.features.key_3')}
                </span>
                <span className="flex items-center gap-2 my-2">
                  <CheckIcon className="w-5 h-5" />
                  {t('login.features.key_4')}
                </span>
              </div>
            </div>
          </div>
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </BoxProvider>
    </div>
  )
}
