import ConfirmModal from '@/components/ConfirmModal'
import { useTranslation } from 'react-i18next'

type ConfirmConfigResetModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm(): void
}

export default function ConfirmConfigResetModal({ isOpen, onClose, onConfirm }: ConfirmConfigResetModalProps) {
  const { t } = useTranslation()
  return (
    <ConfirmModal
      isOpen={isOpen}
      title={t('module.configuration.reset_confirm_title')}
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmColor="btn-error"
    >
      <div className="modal-body">
        <p>{t('module.configuration.reset_confirm_message')}</p>
      </div>
    </ConfirmModal>
  )
}
