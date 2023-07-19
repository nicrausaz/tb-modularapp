import { Link } from 'react-router-dom'
import { LogoutIcon } from '@/assets/icons'
import Image from '@/components/Image'
import { User } from '@/models/User'
import { useTranslation } from 'react-i18next'

type UserDropdownProps = {
  user: User
  onAction: (key: string) => void
}

export default function UserDropdown({ user, onAction }: UserDropdownProps) {
  const { t } = useTranslation()

  return (
    <>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <Image
              src={`/api/box/static/user/${user.avatar}`}
              alt="current_user_avatar"
              fallback="/assets/placeholder.svg"
            />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50"
        >
          <li>
            <a onClick={() => onAction('profile')} className="justify-between">
              {t('menu.user_menu.profile')} <span className="badge">{user.username}</span>
            </a>
          </li>
          <li>
            <Link to={'/about'} className="justify-between">
              {t('menu.user_menu.about')}
            </Link>
          </li>
          <li>
            <a onClick={() => onAction('logout')} className="justify-between">
              {t('menu.user_menu.logout')}
              <LogoutIcon className="w-4 h-4 ml-2" />
            </a>
          </li>
        </ul>
      </div>
    </>
  )
}
