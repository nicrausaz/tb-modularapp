/**
 * Manage the theme of the application
 */

import React, { createContext, useState } from 'react'

const DEFAULT_THEME = 'light'
const STORAGE_KEY = 'theme'

export const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  switchTheme: (theme: string) => {},
})

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME)

  const switchTheme = (theme: string) => {
    setTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }

  return <ThemeContext.Provider value={{ theme, switchTheme }}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
