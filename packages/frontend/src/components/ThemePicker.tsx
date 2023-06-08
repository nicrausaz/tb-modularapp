import { ThemeContext } from '@/contexts/ThemeContext'
import { useContext } from 'react'

// import resolveConfig from 'tailwindcss/resolveConfig'
// import tailwindConfig from '../../tailwind.config'

const ThemePicker = () => {
  const { theme, switchTheme } = useContext(ThemeContext)
  // const fullConfig = resolveConfig(tailwindConfig)
  // console.log(fullConfig)

  // TODO: get them from tailwind.config.js
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
      <select onChange={handleThemeSelection} className="select select-bordered w-full max-w-xs">
        {themes.map((t) => (
          <option value={t} selected={t === theme}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ThemePicker
