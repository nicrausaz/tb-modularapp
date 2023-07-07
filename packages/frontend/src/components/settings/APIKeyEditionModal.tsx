import ConfirmModal from '@/components/ConfirmModal'
import FilePreviewerInput from '@/components/FilePreviewerInput'
import { useEffect, useState } from 'react'
import Input from '@/components/Input'
import { useToast } from '@/contexts/ToastContext'
import { create, update, updateAvatar } from '@/api/requests/users'
import { ValidationError } from '@/api/requests/errors'
import { useTranslation } from 'react-i18next'
import { APIKey } from '@/models/Box'
import { CopyIcon } from '@/assets/icons'

type APIKeyEditionModalProps = {
  isOpen: boolean
  onCancel: () => void
  onConfirm(): void
  APIKey: APIKey | null
}

export default function APIKeyEditionModal({ isOpen, APIKey, onCancel, onConfirm }: APIKeyEditionModalProps) {
  const { t } = useTranslation()

  const [errors, setErrors] = useState({
    name: '',
  })

  const [form, setForm] = useState<{ name: string; key: string }>({
    name: APIKey?.name ?? '',
    key: '',
  })

  const { tSuccess, tError } = useToast()

  useEffect(() => {
    setForm({
      name: APIKey?.name ?? '',
      key: '',
    })
  }, [isOpen])

  // const mode = user ? 'update' : 'create'
  // const title = user ? t('users.edit') : t('users.create')

  const userCreation = async (username: string, password: string): Promise<boolean> => {
    const newUser = {
      username,
      password,
    }

    // return create(newUser)
    //   .then(() => true)
    //   .catch((err) => {
    //     if (err instanceof ValidationError) {
    //       setErrors({
    //         username: err.f('username'),
    //         password: err.f('password'),
    //       })
    //     } else {
    //       tError('Error', 'An error occured while creating the user')
    //     }
    //     return false
    //   })
    return false
  }

  // const userUpdate = async (userId: number, username: string, password: string, avatar: File | null) => {
  //   const newUser: UserUpdate = {
  //     id: userId,
  //     username: username,
  //   }

  //   if (password) {
  //     newUser.password = password
  //   }

  //   if (avatar) {
  //     await updateAvatar(userId, avatar)
  //   }

  //   return update(newUser)
  //     .then(() => true)
  //     .catch((err) => {
  //       if (err instanceof ValidationError) {
  //         setErrors({
  //           username: err.f('username'),
  //           password: err.f('password'),
  //         })
  //       } else {
  //         tError('Error', 'An error occured while creating the user')
  //       }
  //       return false
  //     })
  // }

  // const handleConfirm = async () => {
  //   const { username, password, avatar } = form
  //   if (mode === 'create') {
  //     if (!(await userCreation(username, password))) {
  //       return
  //     }
  //     tSuccess('Success', 'User created')
  //   } else if (mode === 'update' && user) {
  //     if (!(await userUpdate(user?.id, username, password, avatar))) {
  //       return
  //     }
  //     tSuccess('Success', 'User updated')
  //   }

  //   onConfirm()
  // }

  const cleanAndClose = () => {
    // setForm({
    //   username: '',
    //   password: '',
    //   avatar: null,
    // })
    onCancel()
  }

  const obfuscateKey = (key: string) => {
    return key.slice(0, 3) + '*************'
  }

  const copyId = () => {
    navigator.clipboard.writeText(APIKey?.key ?? '')
    tSuccess('Copied', 'Key copied to your clipboard')
  }

  if (!APIKey) {
    return null
  }

  return (
    <ConfirmModal isOpen={isOpen} title="Edit API Key" onConfirm={() => {}} onCancel={cleanAndClose}>
      <div className="modal-body">
        <div className="form-control">
          <Input
            label="name"
            placeholder="Type a reconizable name..."
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
            type="text"
            name="name"
            error={errors.name}
          />

          <div className="join">
            <input
              name="id"
              type="text"
              readOnly={true}
              disabled={true}
              className="input input-bordered w-full join-item"
              value={obfuscateKey(APIKey.key)}
            />
            <button type="button" className="btn join-item flex-grow-0 bg-base-100" onClick={copyId}>
              <CopyIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </ConfirmModal>
  )
}
