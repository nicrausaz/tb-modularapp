import { Link, useNavigate } from 'react-router-dom'
import UserDropdown from '@/components/users/UserDropdown'
import Image from '@/components/Image'
import { useBox } from '@/contexts/BoxContext'
import { useAuth } from '@/contexts/AuthContext'
import UserEditionModal from './users/UserEditionModal'
import { useState } from 'react'

function Navbar() {
  const { authenticatedUser, logout } = useAuth()
  const { box } = useBox()
  const navigate = useNavigate()

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  if (!authenticatedUser || !box) {
    return null
  }

  const handleAction = (key: string) => {
    switch (key) {
      case 'logout':
        logout().then(() => navigate('/login'))
        break
      case 'profile':
        setIsProfileModalOpen(true)
        break
    }
  }

  // const handleEditionClose = () => {
  //   setIsProfileModalOpen(false)
  //   setEditingUser(null)
  // }

  return (
    <div className="navbar bg-base-100 border">
      <div className="navbar-start">
        <Link to={'/'} className="btn btn-ghost normal-case text-xl">
          <Image
            src={`/api/box/static/${box.icon}`}
            fallback="/assets/logo.svg"
            alt="module_icon"
            width={30}
            height={30}
          />
          {box?.name}
        </Link>
      </div>
      <div className="navbar-end">
        <UserDropdown user={authenticatedUser} onAction={handleAction} />
      </div>
      <UserEditionModal
        user={authenticatedUser}
        isOpen={isProfileModalOpen}
        onConfirm={() => setIsProfileModalOpen(false)}
        onCancel={() => {
          setIsProfileModalOpen(false)
        }}
      />
    </div>
  )
}

export default Navbar
