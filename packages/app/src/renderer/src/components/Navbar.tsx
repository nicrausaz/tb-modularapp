import { Link } from 'react-router-dom'
import PlaceholderIcon from '../assets/placeholder.svg'

function Navbar() {
  return (
    <div className="navbar bg-base-100 border">
      <div className="navbar-start">
        <Link to={'/'} className="btn btn-ghost normal-case text-xl">
          Modular App
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <svg className="user-avatar">
                <use xlinkHref={`${PlaceholderIcon}#electron`} />
              </svg>
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
