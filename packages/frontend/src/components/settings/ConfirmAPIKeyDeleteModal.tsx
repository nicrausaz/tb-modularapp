import ConfirmModal from '../ConfirmModal'
import { APIKey } from '@/models/Box'

type ConfirmAPIKeyDeleteModalProps = {
  isOpen: boolean
  APIKey: APIKey | null
  onCancel: () => void
  onConfirm(keyId: number): void
}

export default function ConfirmAPIKeyDeleteModal({
  isOpen,
  onCancel,
  onConfirm,
  APIKey,
}: ConfirmAPIKeyDeleteModalProps) {
  if (!APIKey) {
    return null
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Confirm deletion"
      onConfirm={() => onConfirm(APIKey.id)}
      onCancel={onCancel}
      confirmColor="btn-error"
    >
      <div className="modal-body">
        <p>Are you sure you want to delete the API key <i>{APIKey.name}</i> ?</p>
      </div>
    </ConfirmModal>
  )
}
