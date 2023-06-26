import i18n from '@/libs/i18n'

// TODO
export default function LanguagePicker() {
  const languages = i18n.languages
  const current = i18n.language

  const handleThemeSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <div className="theme-picker">
      <select onChange={handleThemeSelection} className="select select-bordered w-full max-w-xs" defaultValue={current}>
        {languages.map((lang) => (
          <option key={lang}>{lang}</option>
        ))}
      </select>
    </div>
  )
}
