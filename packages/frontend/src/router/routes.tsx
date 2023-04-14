import { Navigate, RouteObject } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import Login from '@/views/Login'
import Error from '@/views/Error'
import Settings from '@/views/Settings'
import Dashboard from '@/views/Dashboard'
import Module from '@/views/Module'

// TODO: use loader
const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
  },
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
        path: '/modules',
        element: <Dashboard />,
      },
      {
        path: '/modules/:moduleId',
        element: <Module />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  // {
  //   path: '*',
  //   element: <Navigate to="/404" replace />,
  // },
]

export default routes
