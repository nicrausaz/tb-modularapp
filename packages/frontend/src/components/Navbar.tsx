import { Link } from 'react-router-dom'
import UserDropdown from '@/components/users/UserDropdown'

function Navbar() {
  return (
    <div className="navbar bg-base-100 border">
      <div className="navbar-start">
        <Link to={'/'} className="btn btn-ghost normal-case text-xl">
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
