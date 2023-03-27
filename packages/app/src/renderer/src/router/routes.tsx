import { Navigate, RouteObject } from 'react-router-dom'

import MainLayout from '@renderer/layouts/MainLayout'
import Error from '@renderer/views/Error'
import Settings from '@renderer/views/Settings'

const routes: RouteObject[] = [
  // TODO: Add login page
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]

export default routes
