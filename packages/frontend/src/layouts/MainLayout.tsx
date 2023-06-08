import FooterNav from '@/components/FooterNav'
import Navbar from '@/components/Navbar'
import ToastContainer from '@/components/ToastContainer'
import { Outlet, useLocation } from 'react-router-dom'

function MainLayout() {
  const active = useLocation().pathname

  const links = [
    {
      to: '/dashboard',
      icon: 'DashboardIcon',
      label: 'Dashboard edition',
    },
    {
      to: '/modules',
      icon: 'BoxIcon',
      label: 'Modules',
    },
    {
      to: '/settings',
      icon: 'SettingsIcon',
      label: 'Settings',
    },
  ]

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="mx-4 my-2">
        <Outlet />
      </div>
      <FooterNav links={links} active={active} />
    </div>
  )
}

export default MainLayout
