import { RouterProvider } from 'react-router-dom'
import { useContext } from 'react'

import router from '@/router'
import { ThemeContext } from './contexts/ThemeContext'

const App: React.FC = () => {
  const { theme } = useContext(ThemeContext)
  return (
    <div className="App" data-theme={theme}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
