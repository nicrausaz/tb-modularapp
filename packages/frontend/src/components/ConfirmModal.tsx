import Modal from './Modal'

type ConfirmModalProps = {
  isOpen: boolean
  title: string
  children: React.ReactNode
  confirmColor?: string
  onConfirm: () => void
  onClose: () => void
}

/**
 * A modal with a confirm and cancel button
 */
export default function ConfirmModal({ isOpen, title, children, onConfirm, onClose, confirmColor }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} title={title} onConfirm={onConfirm} onClose={onClose} confirmColor={confirmColor}>
      <div className="modal-body">{children}</div>
    </Modal>
  )
}
