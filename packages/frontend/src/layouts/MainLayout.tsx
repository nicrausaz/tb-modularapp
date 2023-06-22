import FooterNav from '@/components/FooterNav'
import Navbar from '@/components/Navbar'
import ToastContainer from '@/components/ToastContainer'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

function MainLayout() {
  const active = useLocation().pathname
  const { t } = useTranslation()

  const links = [
    {
      to: '/dashboard',
      icon: 'DashboardIcon',
      label: t('menu.dashboard'),
    },
    {
      to: '/modules',
      icon: 'BoxIcon',
      label: t('menu.modules'),
    },
    {
      to: '/settings',
      icon: 'SettingsIcon',
      label: t('menu.settings'),
    },
  ]

  return (
    <div className="min-h-screen">
      <ToastContainer />
      <Navbar />
      <div>
        <Outlet />
      </div>
      <FooterNav links={links} active={active} />
    </div>
  )
}

export default MainLayout
