import { AddKeyIcon, TrashIcon } from '@/assets/icons'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { useTranslation } from 'react-i18next'
import { APIKey } from '@/models/Box'
import APIKeyCreationModal from './APIKeyCreationModal'
import ConfirmAPIKeyDeleteModal from './ConfirmAPIKeyDeleteModal'
import { deleteAPIKey } from '@/api/requests/box'
import InfoIcon from '../../assets/icons/InfoIcon'

type APIKeyRowProps = {
  APIKey: APIKey
  onClickDelete(key: APIKey): void
}

function APIKeyRow({ APIKey, onClickDelete }: APIKeyRowProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2 flex-1">
        <div>
          {APIKey.name} <span className="text-gray-500">({APIKey.display})</span>
        </div>
      </div>
      <div className="flex-0">
        <button
          className="btn btn-circle btn-error bg-base-100 text-error hover:text-base-100 hover:animate-shaky"
          onClick={() => onClickDelete(APIKey)}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

type APIKeyListProps = {
  keys: APIKey[]
  onUpdated(): void
}

export default function APIKeysList({ keys, onUpdated }: APIKeyListProps) {
  const [keyCreationModalOpen, setKeyCreationModalOpen] = useState(false)
  const [keyDeletionModalOpen, setKeyDeletionModalOpen] = useState(false)
  const [deletingKey, setDeletingKey] = useState<APIKey | null>(null)

  const { t } = useTranslation()
  const { tSuccess } = useToast()

  const handleOpenCreateModal = () => {
    setKeyCreationModalOpen(true)
  }

  const handleOpenDeleteModal = (key: APIKey) => {
    setDeletingKey(key)
    setKeyDeletionModalOpen(true)
  }

  const handleCreationClose = () => {
    setKeyCreationModalOpen(false)
    tSuccess(t('status.success'), t('settings.api_keys.create_success'))
    onUpdated()
  }

  const handleDelete = (id: number) => {
    deleteAPIKey(id).then(() => {
      setKeyDeletionModalOpen(false)
      tSuccess(t('status.success'), t('settings.api_keys.delete_success'))
      onUpdated()
    })
  }

  const handleDeletionClose = () => {
    setKeyDeletionModalOpen(false)
  }

  return (
    <div>
      <div className="border-b py-2">
        <div className="flex items-center justify-between">
          <label className="label">
            <span className="label-text font-bold">{t('settings.api_keys.title')}</span>
            <div
              className="tooltip tooltip-right tooltip-info"
              data-tip="Allows other applications to interact with your modules through the API"
            >
              <label className="btn btn-circle btn-ghost btn-xs text-info">
                <InfoIcon />
              </label>
            </div>
          </label>
          <button className="btn btn-sm mr-2" onClick={handleOpenCreateModal}>
            {t('settings.api_keys.add')}
            <AddKeyIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      {keys.length === 0 && (
        <div className="flex items-center justify-center p-4">
          <div className="text-gray-500">{t('settings.api_keys.empty')}</div>
        </div>
      )}
      {keys.map((key) => (
        <APIKeyRow key={key.id} APIKey={key} onClickDelete={handleOpenDeleteModal} />
      ))}

      <APIKeyCreationModal
        isOpen={keyCreationModalOpen}
        onConfirm={() => {
          handleCreationClose()
          tSuccess(t('status.success'), t('settings.api_keys.create_success'))
        }}
        onCancel={handleCreationClose}
      />

      <ConfirmAPIKeyDeleteModal
        APIKey={deletingKey}
        isOpen={keyDeletionModalOpen}
        onConfirm={handleDelete}
        onCancel={handleDeletionClose}
      />
    </div>
  )
}
