import { User } from '@/models/User'
import ConfirmModal from '../ConfirmModal'

type UserEditionModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm(action: 'create' | 'update', user: User): void
  user: User | null
}

export default function UserEditionModal({ isOpen, user, onClose, onConfirm }: UserEditionModalProps) {
  const mode = user ? 'update' : 'create'
  const title = user ? 'Edit user' : 'Create user'

  const handleConfirm = () => {
    onConfirm(mode, user)
  }

  return (
    <ConfirmModal isOpen={isOpen} title={title} onConfirm={handleConfirm} onClose={onClose}>
      <div className="modal-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Type a username..."
            className="input input-bordered"
            defaultValue={user?.username}
          />

          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input type="password" placeholder="Type a password..." className="input input-bordered" />
        </div>
      </div>
    </ConfirmModal>
  )
}
