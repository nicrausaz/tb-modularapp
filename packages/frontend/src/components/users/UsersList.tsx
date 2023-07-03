import { AddUserIcon, SettingsIcon, TrashIcon } from '@/assets/icons'
import { User } from '@/models/User'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import ConfirmUserDeleteModal from '@/components/users/ConfirmUserDeleteModal'
import UserEditionModal from '@/components/users/UserEditionModal'
import Image from '@/components/Image'
import { remove } from '@/api/requests/users'

type UserRowProps = {
  user: User
  onClickEdit(user: User): void
  onClickDelete(user: User): void
}

function UserRow({ user, onClickEdit, onClickDelete }: UserRowProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2 flex-1">
        <div className="avatar">
          <div className="mask mask-squircle w-10 h-10">
            <Image
              src={`/api/box/static/user/${user.avatar}`}
              alt="current_user_avatar"
              fallback="/assets/placeholder.svg"
            />
            <img src="/assets/placeholder.svg" alt="Avatar Tailwind CSS Component" />
          </div>
        </div>
        <div>
          {user.username} {user.isDefault ? <span className="badge badge-ghost ml-2">Default</span> : ''}
        </div>
      </div>
      <div className="flex-0">
        <button className="btn btn-circle bg-base-100 mr-1" onClick={() => onClickEdit(user)}>
          <SettingsIcon className="w-4 h-4" />
        </button>
        {!user.isDefault && (
          <button className="btn btn-circle bg-base-100" onClick={() => onClickDelete(user)}>
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

type UsersListProps = {
  users: User[]
  onUpdated(): void
}

export default function UsersList({ users, onUpdated }: UsersListProps) {
  const [userEditionModalOpen, setUserEditionModalOpen] = useState(false)
  const [userDeletionModalOpen, setUserDeletionModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const { tSuccess } = useToast()

  const openAddUserModal = () => {
    setUserEditionModalOpen(true)
    setEditingUser(null)
  }

  const openEditUserModal = (user: User) => {
    setUserEditionModalOpen(true)
    setEditingUser(user)
  }

  const openDeleteUserModal = (user: User) => {
    setUserDeletionModalOpen(true)
    setDeletingUser(user)
  }

  const handleConfirm = () => {
    setUserEditionModalOpen(false)
    onUpdated()
  }

  const handleDelete = async (userId: number) => {
    setUserDeletionModalOpen(false)
    await remove(userId)
    tSuccess('Success', 'User deleted')
    onUpdated()
  }

  return (
    <div>
      <div className="border-b py-2">
        <div className="flex items-center justify-between">
          <label className="label">
            <span className="label-text">Users</span>
          </label>
          <button className="btn btn-sm mr-2" onClick={openAddUserModal}>
            add
            <AddUserIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      {users.map((user) => (
        <UserRow key={user.id} user={user} onClickEdit={openEditUserModal} onClickDelete={openDeleteUserModal} />
      ))}

      <UserEditionModal
        user={editingUser}
        isOpen={userEditionModalOpen}
        onConfirm={handleConfirm}
        onClose={() => setUserEditionModalOpen(false)}
      />
      <ConfirmUserDeleteModal
        user={deletingUser}
        isOpen={userDeletionModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setUserDeletionModalOpen(false)}
      />
    </div>
  )
}
