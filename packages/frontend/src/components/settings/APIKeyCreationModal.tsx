import ConfirmModal from '@/components/ConfirmModal'
import { useState } from 'react'
import Input from '@/components/Input'
import { useToast } from '@/contexts/ToastContext'
import { useTranslation } from 'react-i18next'
import { ArrowRightIcon, CopyIcon } from '@/assets/icons'
import WarningIcon from '@/assets/icons/WarningIcon'
import { generateAPIKey } from '@/api/requests/box'

type APIKeyCreationModalProps = {
  isOpen: boolean
  onCancel: () => void
  onConfirm(): void
}

export default function APIKeyCreationModal({ isOpen, onCancel, onConfirm }: APIKeyCreationModalProps) {
  const { t } = useTranslation()

  const [generationStep, setGenerationStep] = useState(0)
  const [keyName, setKeyName] = useState<string>('')
  const [APIKey, setAPIKey] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const { tSuccess } = useToast()

  const cleanAndClose = () => {
    setKeyName('')
    setGenerationStep(0)
    onCancel()
  }

  const copyId = () => {
    navigator.clipboard.writeText(APIKey)
    tSuccess(t('settings.api_keys.generation.copied_title'), t('settings.api_keys.generation.copied_message'))
  }

  const nextStep = () => {
    setGenerationStep((prev) => prev + 1)
    setLoading(true)

    generateAPIKey(keyName).then((key) => {
      setAPIKey(key)
      setLoading(false)
    })
  }

  const handleConfirm = () => {
    copyId()
    setKeyName('')
    setGenerationStep(0)
    onConfirm()
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={t('settings.api_keys.generation.title')}
      onConfirm={handleConfirm}
      onCancel={cleanAndClose}
      confirmHidden={APIKey === ''}
      confirmText={t('settings.api_keys.generation.confirm')}
      cancelText={t('settings.api_keys.generation.cancel')}
      cancelEnabled={generationStep !== 1}
    >
      <div className="modal-body">
        <ul className="steps mt-4 w-full">
          <li className="step step-primary">{t('settings.api_keys.generation.chose_name')}</li>
          <li className={`step ${generationStep === 1 ? 'step-primary' : ''}`} data-content="🔑">
            {generationStep === 1
              ? t('settings.api_keys.generation.generated_key')
              : t('settings.api_keys.generation.generate_key')}
          </li>
        </ul>
        {generationStep === 0 && (
          <div className="form-control">
            <Input
              label={t('settings.api_keys.generation.name')}
              placeholder={t('settings.api_keys.generation.name_placeholder')}
              value={keyName}
              onChange={(value) => setKeyName(value)}
              type="text"
              name="name"
            />
            <button className="btn btn-block " onClick={nextStep} disabled={keyName === ''}>
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
        )}
        {generationStep === 1 && (
          <div className="form-control py-2">
            {loading && (
              <div className="mx-auto">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            )}

            {!loading && (
              <div>
                <div className="alert alert-warning mb-2">
                  <WarningIcon />
                  <span>{t('settings.api_keys.generation.once_warning')}</span>
                </div>
                <div className="join w-full">
                  <input
                    name="id"
                    type="text"
                    readOnly={true}
                    disabled={true}
                    className="input input-bordered w-full join-item"
                    value={APIKey}
                  />
                  <button type="button" className="btn join-item flex-grow-0 bg-base-100" onClick={copyId}>
                    <CopyIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ConfirmModal>
  )
}
