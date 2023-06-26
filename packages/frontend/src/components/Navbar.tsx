import { Link } from 'react-router-dom'
import UserDropdown from '@/components/users/UserDropdown'
import Image from '@/components/Image'

function Navbar() {
  return (
    <div className="navbar bg-base-100 border">
      <div className="navbar-start">
        <Link to={'/'} className="btn btn-ghost normal-case text-xl">
          <Image src="/assets/logo.svg" fallback="/assets/logo.svg" alt="module_icon" width={30} height={30} />
          Modular App
        </Link>
      </div>
      <div className="navbar-end">
        <UserDropdown />
      </div>
    </div>
  )
}

export default Navbar
