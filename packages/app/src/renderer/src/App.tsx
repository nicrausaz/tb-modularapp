import { RouterProvider } from 'react-router-dom'

import router from '@renderer/router'

function App(): JSX.Element {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
