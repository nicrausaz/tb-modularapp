import Modal from './Modal'

type ConfirmModalProps = {
  isOpen: boolean
  title: string
  children: React.ReactNode
  confirmColor?: string
  confirmEnabled?: boolean
  cancelText?: string
  confirmText?: string
  confirmHidden?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * A modal with a confirm and cancel button
 */
export default function ConfirmModal({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmColor,
  confirmEnabled = true,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmHidden = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmColor={confirmColor}
      confirmEnabled={confirmEnabled}
      cancelText={cancelText}
      confirmText={confirmText}
      confirmHidden={confirmHidden}
    >
      <div className="modal-body">{children}</div>
    </Modal>
  )
}
