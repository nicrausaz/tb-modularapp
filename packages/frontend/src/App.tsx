import { RouterProvider } from 'react-router-dom'
import { useContext } from 'react'

import router from '@/router'
import { ThemeContext } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { LiveEventsProvider } from './contexts/LiveEvents'

const App: React.FC = () => {
  const { theme } = useContext(ThemeContext)
  return (
    <div className="App" data-theme={theme}>
      <AuthProvider>
        <ToastProvider>
          <LiveEventsProvider>
            <RouterProvider router={router} />
          </LiveEventsProvider>
        </ToastProvider>
      </AuthProvider>
    </div>
  )
}

export default App
