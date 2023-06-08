import { RouterProvider } from 'react-router-dom'
import { useContext } from 'react'

import router from '@/router'
import { ThemeContext } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'

const App: React.FC = () => {
  const { theme } = useContext(ThemeContext)
  return (
    <div className="App" data-theme={theme}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </div>
  )
}

export default App
