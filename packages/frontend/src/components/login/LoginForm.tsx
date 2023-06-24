import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import IconButton from '../IconButton'
import { LoginIcon } from '@/assets/icons'

type LoginFormProps = {
  onSubmit: (username: string, password: string) => void
}

/**
 * Login form component.
 * Allows the user to enter their username and password.
 * @returns
 */
export default function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation()

  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (form.username === '' || form.password === '') {
      return
    }

    onSubmit(form.username, form.password)
  }

  //  border border-error shadow-error
  return (
    <form className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100" onSubmit={handleFormSubmit} action="">
      <div className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('login.form.username')}</span>
          </label>
          <input
            type="text"
            placeholder="username"
            className="input input-bordered"
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value,
              })
            }
            autoCapitalize="off"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">{t('login.form.password')}</span>
          </label>
          <input
            type="password"
            placeholder="password"
            className="input input-bordered"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
        </div>
        <div className="form-control mt-6">
          <IconButton
            icon={<LoginIcon />}
            label={t('login.form.submit')}
            type="submit"
            className="btn-primary"
            position="right"
            keepLabel={true}
          />
        </div>
      </div>
    </form>
  )
}
