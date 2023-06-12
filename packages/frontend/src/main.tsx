import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import '@/libs/i18n'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)
