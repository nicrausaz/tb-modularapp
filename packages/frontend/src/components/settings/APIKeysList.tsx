import { AddKeyIcon, SettingsIcon, TrashIcon } from '@/assets/icons'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { useTranslation } from 'react-i18next'
import { APIKey } from '@/models/Box'
import APIKeyEditionModal from './APIKeyEditionModal'

type APIKeyRowProps = {
  APIKey: APIKey
  onClickEdit(key: APIKey): void
  onClickDelete(key: APIKey): void
}

function APIKeyRow({ APIKey, onClickEdit, onClickDelete }: APIKeyRowProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2 flex-1">
        <div>{APIKey.name}</div>
      </div>
      <div className="flex-0">
        <button className="btn btn-circle bg-base-100 mr-1" onClick={() => onClickEdit(APIKey)}>
          <SettingsIcon className="w-4 h-4" />
        </button>
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
  const [keyEditionModalOpen, setKeyEditionModalOpen] = useState(false)
  // const [keyDeletionModalOpen, setKeyDeletionModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<APIKey | null>(null)
  // const [deletingKey, setDeletingKey] = useState<APIKey | null>(null)

  const { t } = useTranslation()
  const { tSuccess } = useToast()

  keys = [
    {
      id: '1',
      name: 'Test 1',
      key: '1234567890',
    },
    {
      id: '2',
      name: 'Test 2',
      key: '1234567890',
    },
    {
      id: '3',
      name: 'Test 3',
      key: '1234567890',
    },
  ]

  const handleOpenEditionModal = (key: APIKey) => {
    setEditingKey(key)
    setKeyEditionModalOpen(true)
  }

  const handleEditionClose = () => {
    setKeyEditionModalOpen(false)
    setEditingKey(null)
  }

  const handleConfirm = () => {
    setKeyEditionModalOpen(false)
    setEditingKey(null)
    tSuccess('Success', 'API key updated')
    onUpdated()
  }

  return (
    <div>
      <div className="border-b py-2">
        <div className="flex items-center justify-between">
          <label className="label">
            <span className="label-text font-bold">{t('settings.api_keys.title')}</span>
          </label>
          <button className="btn btn-sm mr-2" onClick={() => {}}>
            {t('settings.api_keys.add')}
            <AddKeyIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      {keys.map((key) => (
        <APIKeyRow key={key.id} APIKey={key} onClickEdit={handleOpenEditionModal} onClickDelete={() => {}} />
      ))}

      <APIKeyEditionModal
        APIKey={editingKey}
        isOpen={keyEditionModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleEditionClose}
      />

      {/*
      <ConfirmKeyDeleteModal
        Key={deletingKey}
        isOpen={KeyDeletionModalOpen}
        onConfirm={handleDelete}
        onCancel={handleDeletionClose}
      /> */}
    </div>
  )
}
