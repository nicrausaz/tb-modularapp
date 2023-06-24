import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import IconButton from '../IconButton'
import { LoginIcon } from '@/assets/icons'
import Input from '../Input'

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
    usernameError: '',
    passwordError: '',
  })

  const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (form.username === '' || form.password === '') {
      setForm({
        ...form,
        usernameError: form.username === '' ? t('login.form.username_error') : '',
        passwordError: form.password === '' ? t('login.form.password_error') : '',
      })
      return
    }

    setForm({
      ...form,
      usernameError: '',
      passwordError: '',
    })

    onSubmit(form.username, form.password)
  }

  //  border border-error shadow-error
  return (
    <form className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100" onSubmit={handleFormSubmit} action="">
      <div className="card-body">
        <div className="form-control">
          <Input
            label={t('login.form.username')}
            type="text"
            name="username"
            value={form.username}
            onChange={(value) => setForm({ ...form, username: value })}
            placeholder={t('login.form.username_placeholder')}
            props={{
              autoCapitalize: 'off',
            }}
            error={form.usernameError}
          />

          <Input
            label={t('login.form.password')}
            type="password"
            name="password"
            value={form.password}
            onChange={(value) => setForm({ ...form, password: value })}
            placeholder={t('login.form.password_placeholder')}
            error={form.passwordError}
          />

          <IconButton
            icon={<LoginIcon className="w-4 h-4" />}
            label={t('login.form.submit')}
            type="submit"
            className="btn-primary mt-3"
            position="right"
            keepLabel={true}
          />
        </div>
      </div>
    </form>
  )
}
