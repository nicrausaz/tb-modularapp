import { useEffect, useRef } from 'react'

type ModalProps = {
  isOpen: boolean
  onConfirm?: () => void
  onCancel: () => void
  children: React.ReactNode
  title?: string
  confirmEnabled?: boolean
  confirmColor?: string
}

/**
 * A generic modal component
 */
export default function Modal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  children,
  confirmEnabled = true,
  confirmColor = 'btn-primary',
}: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal()
      // modalRef.current?.addEventListener('cancel', onClose)
    } else {
      // modalRef.current?.removeEventListener('cancel', onClose)
      modalRef.current?.close()
    }
  }, [isOpen])

  const confirmClasses = `btn ${confirmEnabled ? confirmColor : 'btn-disabled'}`

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onConfirm) {
      onConfirm()
    }
  }

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle shadow-lg">
      <form method="dialog" className="modal-box" onSubmit={handleSubmit}>
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <button type="button" className="btn" onClick={onCancel}>
            Close
          </button>
          <button type="submit" className={confirmClasses}>
            Confirm
          </button>
        </div>
      </form>
    </dialog>
  )
}
