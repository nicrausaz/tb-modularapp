import { AddUserIcon, SettingsIcon, TrashIcon } from '@/assets/icons'
import { User } from '@/models/User'
import UserEditionModal from './UserEditionModal'
import { useState } from 'react'
import fetcher from '@/api/fetcher'

type UsersListProps = {
  users: User[]
}

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
            <img src="/assets/placeholder.svg" alt="Avatar Tailwind CSS Component" />
          </div>
        </div>
        {user.username}
      </div>
      <div className="flex-0">
        <button className="btn btn-circle bg-base-100 mr-1" onClick={() => onClickEdit(user)}>
          <SettingsIcon className="w-4 h-4" />
        </button>
        <button className="btn btn-circle bg-base-100" onClick={() => onClickDelete(user)}>
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function UsersList({ users }: UsersListProps) {
  const [userEditionModalOpen, setUserEditionModalOpen] = useState(false)
  const [userDeletionModalOpen, setUserDeletionModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

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

  const handleConfirm = async (action: string, user: User) => {
    setUserEditionModalOpen(false)

    if (action === 'create') {
      await fetcher('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    } else {
      await fetcher(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    }
  }

  return (
    <div>
      <div className="border-b py-2">
        <div className="flex items-center justify-between">
          <h3>Users</h3>
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
      {/* <ConfirmUserDeleteModal isOpen={userDeletionModalOpen} /> */}
    </div>
  )
}
