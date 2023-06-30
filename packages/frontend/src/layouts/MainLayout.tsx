import FooterNav from '@/components/FooterNav'
import Navbar from '@/components/Navbar'
import ToastContainer from '@/components/ToastContainer'
import { BoxProvider } from '@/contexts/BoxContext'
import AuthenticatedRoute from '@/router/AuthenticatedRoute'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'
import { LiveModulesProvider } from '@/contexts/LiveModules'

/**
 * Layout for the main pages, should be authenticated
 */
export default function MainLayout() {
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
    <AuthenticatedRoute>
      <div className="min-h-screen">
        <BoxProvider>
          <LiveModulesProvider>
            <ToastContainer />
            <Navbar />
            <div>
              <Outlet />
            </div>
            <FooterNav links={links} active={active} />
          </LiveModulesProvider>
        </BoxProvider>
      </div>
    </AuthenticatedRoute>
  )
}
