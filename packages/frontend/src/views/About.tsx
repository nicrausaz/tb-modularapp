import { GitHubIcon, WebIcon } from '@/assets/icons'
import IconButton from '@/components/IconButton'
import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="bg-gradient-to-r from-primary to-accent flex items-center justify-center h-screen">
      <div className="max-w-md p-6 rounded-xl bg-base-100 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img src="/assets/logo.svg" alt="Logo" className="w-16 h-16 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800">{t('about.app_basename')}</h1>
        </div>
        <p className="text-lg mb-4">{t('about.description')}</p>
        <div className="flex justify-center gap-2">
          <IconButton
            icon={<GitHubIcon className="w-6 h-6" />}
            asLink={true}
            to="https://github.com/nicrausaz/tb-modularapp/"
            target="_blank"
            label={t('about.links.github')}
            position="left"
            className="btn-primary"
          />

          <IconButton
            icon={<WebIcon className="w-6 h-6" />}
            asLink={true}
            to="https://example.com"
            target="_blank"
            label={t('about.links.website')}
            position="left"
            className="btn-primary"
          />
        </div>
      </div>
    </div>
  )
}
