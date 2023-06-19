import Modal from './Modal'

type ConfirmModalProps = {
  isOpen: boolean
  title: string
  children: React.ReactNode
  confirmColor?: string
  confirmEnabled?: boolean
  onConfirm: () => void
  onClose: () => void
}

/**
 * A modal with a confirm and cancel button
 */
export default function ConfirmModal({
  isOpen,
  title,
  children,
  onConfirm,
  onClose,
  confirmColor,
  confirmEnabled = true,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onConfirm={onConfirm}
      onClose={onClose}
      confirmColor={confirmColor}
      confirmEnabled={confirmEnabled}
    >
      <div className="modal-body">{children}</div>
    </Modal>
  )
}
