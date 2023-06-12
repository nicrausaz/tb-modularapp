import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, token, getAuthenticatedUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (username === '' || password === '') {
      return
    }

    login(username, password)
      .then(() => {
        getAuthenticatedUser().then(() => navigate('/dashboard'))
      })
      .catch((err) => {
        console.log('TODO: display error', err)
      })
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">{t('login.title')}</h1>
          <p className="py-6">{t('login.subtitle')}</p>
        </div>
        <form
          className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
          onSubmit={handleFormSubmit}
          action=""
        >
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('login.form.email')}</span>
              </label>
              <input type="text" placeholder="email" className="input input-bordered" onChange={handleUsernameChange} />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('login.form.password')}</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                onChange={handlePasswordChange}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                {t('login.form.forgot')}
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <input type="submit" className="btn btn-primary" value={t('login.form.submit') ?? ''} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
