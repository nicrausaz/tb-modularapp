import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import UserEditionModal from './UserEditionModal'
import { useState } from 'react'
import { LogoutIcon } from '@/assets/icons'

export default function UserDropdown() {
  const { logout, authenticatedUser } = useAuth()
  const navigate = useNavigate()

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleLogout = () => {
    logout().then(() => navigate('/login'))
  }

  return (
    <>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src="/assets/placeholder.svg" className="user-avatar" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50"
        >
          <li>
            <a onClick={() => setIsProfileModalOpen(true)} className="justify-between">
              Profile <span className="badge">{authenticatedUser?.username}</span>
            </a>
          </li>
          <li>
            <Link to={'/about'} className="justify-between">
              About
            </Link>
          </li>
          <li>
            <a onClick={handleLogout} className="justify-between">
              Logout
              <LogoutIcon className="w-4 h-4 ml-2" />
            </a>
          </li>
        </ul>
      </div>
      <UserEditionModal
        user={authenticatedUser}
        isOpen={isProfileModalOpen}
        onConfirm={() => {}}
        onClose={() => {
          setIsProfileModalOpen(false)
        }}
      />
    </>
  )
}
