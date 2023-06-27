import { Navigate, RouteObject } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import Login from '@/views/Login'
import Error from '@/views/Error'
import Settings from '@/views/Settings'
import Dashboard from '@/views/Dashboard'
import Module from '@/views/Module'
import Modules from '@/views/Modules'
import Home from '@/views/Home'
import Visualize from '@/views/Visualize'
import About from '@/views/About'
import UnrestrictedLayout from '@/layouts/UnrestrictedLayout'

const routes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <UnrestrictedLayout>
        <Login />
      </UnrestrictedLayout>
    ),
    errorElement: <Error />,
  },
  {
    path: '/visualize/:screenId',
    element: (
      <UnrestrictedLayout>
        <Visualize />
      </UnrestrictedLayout>
    ),
    errorElement: <Error />,
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
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
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/about',
        element: <About />,
      },
    ],
  },
  {
    path: '/error',
    element: <Error />,
  },
  {
    path: '*',
    element: <Navigate to="/error" replace />,
  },
]

export default routes
