/**
 * Manage the theme of the application
 */

import React, { createContext, useState } from 'react'

const DEFAULT_THEME = 'light'
const STORAGE_KEY = 'theme'

type ThemeContextType = {
  theme: string
  switchTheme?: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
})

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME)

  const switchTheme = (theme: string) => {
    setTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }

  return <ThemeContext.Provider value={{ theme, switchTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeContext, ThemeProvider }
