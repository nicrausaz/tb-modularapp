import { User, UserUpdate } from '@/models/User'
import ConfirmModal from '@/components/ConfirmModal'
import FilePreviewerInput from '@/components/FilePreviewerInput'
import { useState } from 'react'
import Input from '@/components/Input'
import { useToast } from '@/contexts/ToastContext'
import { create, update, updateAvatar } from '@/api/requests/users'
import { ValidationError } from '@/api/requests/errors'
import { useTranslation } from 'react-i18next'

type UserEditionModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm(): void
  user: User | null
}

export default function UserEditionModal({ isOpen, user, onClose, onConfirm }: UserEditionModalProps) {
  const { t } = useTranslation()

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  })

  const { tSuccess, tError } = useToast()

  if (!isOpen) {
    return null
  }

  const mode = user ? 'update' : 'create'
  const title = user ? t('users.edit') : t('users.create')

  const [form, setForm] = useState<{ username: string; password: string; avatar: File | null }>({
    username: user?.username ?? '',
    password: '',
    avatar: null,
  })



  const userCreation = async (username: string, password: string): Promise<boolean> => {
    const newUser = {
      username,
      password,
    }

    return create(newUser)
      .then(() => true)
      .catch((err) => {
        if (err instanceof ValidationError) {
          setErrors({
            username: err.f('username'),
            password: err.f('password'),
          })
        } else {
          tError('Error', 'An error occured while creating the user')
        }
        return false
      })
  }

  const userUpdate = async (userId: number, username: string, password: string, avatar: File | null) => {
    const newUser: UserUpdate = {
      id: userId,
      username: username,
    }

    if (password) {
      newUser.password = password
    }

    if (avatar) {
      await updateAvatar(userId, avatar)
    }

    return update(newUser)
      .then(() => true)
      .catch((err) => {
        if (err instanceof ValidationError) {
          setErrors({
            username: err.f('username'),
            password: err.f('password'),
          })
        } else {
          tError('Error', 'An error occured while creating the user')
        }
        return false
      })
  }

  const handleConfirm = async () => {
    const { username, password, avatar } = form
    if (mode === 'create') {
      if (!(await userCreation(username, password))) {
        return
      }
      tSuccess('Success', 'User created')
    } else if (mode === 'update' && user) {
      if (!(await userUpdate(user?.id, username, password, avatar))) {
        return
      }
      tSuccess('Success', 'User updated')
    }

    onConfirm()
  }

  const cleanAndClose = () => {
    setForm({
      username: '',
      password: '',
      avatar: null,
    })
    onClose()
  }

  return (
    <ConfirmModal isOpen={isOpen} title={title} onConfirm={handleConfirm} onCancel={cleanAndClose}>
      <div className="modal-body">
        <div className="form-control">
          {mode === 'update' && user && (
            <div className="mx-auto">
              <FilePreviewerInput
                onUpload={(file) => setForm({ ...form, avatar: file })}
                currentPicture={user.avatar ? `/api/box/static/user/${user.avatar}` : ''}
                allowedFormats={['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']}
                className="w-32 h-32"
                placeholder="/assets/placeholder.svg"
              />
            </div>
          )}
          <Input
            label="Username"
            placeholder="Type a username..."
            value={form.username}
            onChange={(value) => setForm({ ...form, username: value })}
            type="text"
            name="username"
            error={errors.username}
          />

          <Input
            label={mode === 'create' ? 'Password' : 'Password (leave empty to keep the same password)'}
            placeholder="Type a password..."
            value={form.password}
            onChange={(value) => setForm({ ...form, password: value })}
            type="password"
            name="password"
            error={errors.password}
          />
        </div>
      </div>
    </ConfirmModal>
  )
}
