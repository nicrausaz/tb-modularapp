import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-primary to-accent">
      <div className="px-40 py-20 bg-white rounded-md shadow-xl">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-primary text-9xl">404</h1>

          <h6 className="mb-6 text-2xl font-bold text-center text-neutral md:text-3xl">
            <span className="text-error">{t('errors.not_found.subtitle')}</span>
          </h6>

          <Link className="btn btn-primary" to={'/'}>
            {t('errors.not_found.button')}
          </Link>
        </div>
      </div>
    </div>
  )
}
