import FooterNav from '@renderer/components/FooterNav'
import Navbar from '@renderer/components/Navbar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className='mx-4 my-2'>
        <Outlet />
      </div>
      <FooterNav />
    </div>
  )
}

export default MainLayout
