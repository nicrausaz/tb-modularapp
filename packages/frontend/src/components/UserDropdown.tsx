import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function UserDropdown() {
  const { logout, authenticatedUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout().then(() => navigate('/login'))
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src="/assets/placeholder.svg" className="user-avatar" />
        </div>
      </label>
      <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li>
          <Link to={'/profile'} className="justify-between">
            Profile <span className="badge">{authenticatedUser?.username}</span>
          </Link>
        </li>
        <li>
          <a onClick={handleLogout}>Logout</a>
        </li>
      </ul>
    </div>
  )
}
