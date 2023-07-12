import { ThemeContext } from '@/contexts/ThemeContext'
import { useContext } from 'react'

const ThemePicker = () => {
  const { theme, switchTheme } = useContext(ThemeContext)

  const themes = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
  ]

  const handleThemeSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switchTheme && switchTheme(event.target.value)
  }

  return (
    <div className="theme-picker">
      <select onChange={handleThemeSelection} className="select select-bordered w-full max-w-xs" defaultValue={theme}>
        {themes.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
    </div>
  )
}

export default ThemePicker
