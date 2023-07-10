import { Screen } from '@/models/Screen'
import ConfirmModal from '../ConfirmModal'

type ConfirmScreenDeleteModalProps = {
  isOpen: boolean
  screen: Screen
  onClose: () => void
  onConfirm(screenId: number): void
}

export default function ConfirmScreenDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  screen,
}: ConfirmScreenDeleteModalProps) {
  if (!screen) {
    return null
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Confirm deletion"
      onConfirm={() => onConfirm(screen.id)}
      onCancel={onClose}
      confirmColor="btn-error"
    >
      <div className="modal-body">
        <p>Are you sure you want to delete the screen {screen.name} ?</p>
      </div>
    </ConfirmModal>
  )
}
