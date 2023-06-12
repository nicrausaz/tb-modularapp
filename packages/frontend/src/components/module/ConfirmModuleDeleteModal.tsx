import { Module } from '@/models/Module'
import ConfirmModal from '../ConfirmModal'

type ConfirmModuleDeleteModalProps = {
  isOpen: boolean
  module: Module
  onClose: () => void
  onConfirm(moduleId: string): void
}

export default function ConfirmModuleDeleteModal({ isOpen, onClose, onConfirm, module }: ConfirmModuleDeleteModalProps) {
  if (!module) {
    return null
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Confirm deletion"
      onConfirm={() => onConfirm(module.id)}
      onClose={onClose}
      confirmColor='btn-error'
    >
      <div className="modal-body">
        <p>Are you sure you want to delete the module {module.name} ?</p>
      </div>
    </ConfirmModal>
  )
}
