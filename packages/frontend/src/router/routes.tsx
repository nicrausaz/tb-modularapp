import { Navigate, RouteObject } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import Login from '@/views/Login'
import Error from '@/views/Error'
import Settings from '@/views/Settings'
import Dashboard from '@/views/Dashboard'
import Module from '@/views/Module'
import Modules from '@/views/Modules'
import * as Api from '@/api/api'

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
        element: <Modules />,
      },
      {
        path: '/modules/:moduleId',
        element: <Module />,
        // loader: ({ id }: { id: string }) => Api.getModuleById(id),
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
