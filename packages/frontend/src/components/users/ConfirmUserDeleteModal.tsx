import ConfirmModal from '../ConfirmModal'
import { User } from '@/models/User'

type ConfirmModuleDeleteModalProps = {
  isOpen: boolean
  user: User | null
  onConfirm(userId: number): void
  onCancel: () => void
}

export default function ConfirmModuleDeleteModal({ isOpen, onCancel, onConfirm, user }: ConfirmModuleDeleteModalProps) {
  if (!user) {
    return null
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Confirm deletion"
      onConfirm={() => onConfirm(user.id)}
      onCancel={onCancel}
      confirmColor="btn-error"
    >
      <div className="modal-body">
        <p>Are you sure you want to delete the user {user.username} ?</p>
      </div>
    </ConfirmModal>
  )
}
