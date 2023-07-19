import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
}

const configuredLanguage = localStorage.getItem('preferred_language') || 'en'

const setLanguage = (language: string) => {
  localStorage.setItem('preferred_language', language)
  i18n.changeLanguage(language)
}

i18n.use(initReactI18next).init({
  resources,
  lng: configuredLanguage,
  fallbackLng: ['en', 'fr'],
  supportedLngs: ['en', 'fr'],
  interpolation: {
    escapeValue: false,
  },
})

export { i18n, setLanguage }
