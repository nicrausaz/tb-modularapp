import { i18n, setLanguage } from '@/libs/i18n'

/**
 * Input to select the UI language
 */
export default function LanguagePicker() {
  const languages = i18n.options.supportedLngs || []
  const current = i18n.language

  const handleThemeSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value)
  }

  return (
    <select onChange={handleThemeSelection} className="select select-bordered w-full max-w-xs" value={current}>
      {languages.map((lang) => (
        <option key={lang}>{lang}</option>
      ))}
    </select>
  )
}
