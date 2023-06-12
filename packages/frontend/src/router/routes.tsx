import { Navigate, RouteObject } from 'react-router-dom'

import MainLayout from '@/layouts/MainLayout'
import Login from '@/views/Login'
import Error from '@/views/Error'
import Settings from '@/views/Settings'
import Dashboard from '@/views/Dashboard'
import Module from '@/views/Module'
import Modules from '@/views/Modules'
import AuthenticatedRoute from './AuthenticatedRoute'
import Home from '@/views/Home'
import Visualize from '@/views/Visualize'
import Profile from '@/views/Profile'

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: '/visualize/:screenId',
    element: <Visualize />,
    errorElement: <Error />,
  },
  {
    path: '/',
    element: (
      <AuthenticatedRoute>
        <MainLayout />
      </AuthenticatedRoute>
    ),
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
        path: '/profile',
        element: <Profile />,
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
