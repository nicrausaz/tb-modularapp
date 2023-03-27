import React from 'react'
import { RouterProvider } from 'react-router-dom'

import router from '@renderer/router'

function App(): JSX.Element {
  return (
    <React.StrictMode>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </React.StrictMode>

    // <Navbar />
    // <button className="btn btn-primary">Button</button>
    // <FooterNav />
  )
}

export default App
