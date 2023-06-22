import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ErrorPage() {
  const error = useRouteError()
  const { t } = useTranslation()

  console.log(error)

  if (!isRouteErrorResponse(error)) {
    return <>unhandled</>
  }

  // TODO: match on types of errors to display different messages

  return (
    <div className="flex items-center justify-center w-screen h-screen  bg-gradient-to-r from-primary to-accent">
      <div className="px-40 py-20 bg-white rounded-md shadow-xl">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-primary text-9xl">{error ? 403 : 404}</h1>

          <h6 className="mb-2 text-2xl font-bold text-center text-neutral md:text-3xl">
            <span className="text-error">Oops !</span>
          </h6>
          {error ? (
            <p className="mb-8 text-center text-neutral md:text-lg">{error.statusText}</p>
          ) : (
            <p className="mb-8 text-center text-neutral md:text-lg">{t('errors.not_found.subtitle')}</p>
          )}

          <Link className="btn btn-primary" to={'/'}>
            {t('errors.not_found.button')}
          </Link>
        </div>
      </div>
    </div>
  )
}
