import { Navigate, RouteObject } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import Error from '@/views/Error'
import Settings from '@/views/Settings'
import Dashboard from '@/views/Dashboard'

const routes: RouteObject[] = [
  // TODO: Add login page
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
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
