import { useEffect, useRef } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
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
  onClose,
  onConfirm,
  title,
  children,
  confirmEnabled = true,
  confirmColor = 'btn-primary',
}: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal()
      modalRef.current?.addEventListener('cancel', onClose)
    } else {
      modalRef.current?.removeEventListener('cancel', onClose)
      modalRef.current?.close()
    }
  }, [isOpen])

  const confirmClasses = `btn ${confirmEnabled ? confirmColor : 'btn-disabled'}`

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle shadow-lg">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
          <button className={confirmClasses} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </form>
    </dialog>
  )
}
