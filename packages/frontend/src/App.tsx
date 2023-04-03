import { RouterProvider } from 'react-router-dom'

import router from '@/router'

function App(): JSX.Element {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
