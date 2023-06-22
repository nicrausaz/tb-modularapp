import { useTranslation } from 'react-i18next'
import { useState } from 'react'

type LoginFormProps = {
  onSubmit: (username: string, password: string) => void
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation()

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

    onSubmit(username, password)
  }

  return (
    <form className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100" onSubmit={handleFormSubmit} action="">
      <div className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('login.form.username')}</span>
          </label>
          <input type="text" placeholder="username" className="input input-bordered" onChange={handleUsernameChange} />
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
  )
}
