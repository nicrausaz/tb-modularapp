import { useRouteError, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ErrorPage() {
  const error = useRouteError() as Error
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-primary to-accent">
      <div className="px-40 py-20 bg-white rounded-md shadow-xl">
        <div className="flex flex-col items-center">
          <h6 className="mb-6 text-2xl font-bold text-center text-neutral md:text-3xl">
            <span className="text-error">{error.message}</span>
          </h6>
          {error ? <></> : <p className="mb-8 text-center text-neutral md:text-lg">{t('errors.not_found.subtitle')}</p>}

          <Link className="btn btn-primary" to={'/'}>
            {t('errors.not_found.button')}
          </Link>
        </div>
      </div>
    </div>
  )
}
