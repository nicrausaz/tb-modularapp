import { useEffect, useRef } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  children: React.ReactNode
  title?: string
}

export default function Modal({ isOpen, onClose, onConfirm, title, children }: ModalProps) {
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

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </form>
    </dialog>
  )
}
