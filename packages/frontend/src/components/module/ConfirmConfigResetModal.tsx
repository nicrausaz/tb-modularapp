import ConfirmModal from '@/components/ConfirmModal'

type ConfirmConfigResetModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm(): void
}

export default function ConfirmConfigResetModal({ isOpen, onClose, onConfirm }: ConfirmConfigResetModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Confirm configuration reset"
      onConfirm={onConfirm}
      onClose={onClose}
      confirmColor="btn-error"
    >
      <div className="modal-body">
        <p>Are you sure you want to reset the configuration to its default values ?</p>
      </div>
    </ConfirmModal>
  )
}
