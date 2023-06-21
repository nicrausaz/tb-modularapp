import ConfirmModal from '../ConfirmModal'
import { User } from '@/models/User'

type ConfirmModuleDeleteModalProps = {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onConfirm(userId: number): void
}

export default function ConfirmModuleDeleteModal({ isOpen, onClose, onConfirm, user }: ConfirmModuleDeleteModalProps) {
  if (!user) {
    return null
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Confirm deletion"
      onConfirm={() => onConfirm(user.id)}
      onClose={onClose}
      confirmColor="btn-error"
    >
      <div className="modal-body">
        <p>Are you sure you want to delete the user {user.username} ?</p>
      </div>
    </ConfirmModal>
  )
}
