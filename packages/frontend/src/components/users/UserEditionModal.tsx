import { User, UserUpdate } from '@/models/User'
import ConfirmModal from '@/components/ConfirmModal'
import FilePreviewerInput from '@/components/FilePreviewerInput'
import { useEffect, useState } from 'react'
import Input from '@/components/Input'
import { useToast } from '@/contexts/ToastContext'
import { create, update, updateAvatar } from '@/api/requests/users'
import { ValidationError } from '@/api/requests/errors'
import { useTranslation } from 'react-i18next'

type UserEditionModalProps = {
  isOpen: boolean
  onCancel: () => void
  onConfirm(): void
  user: User | null
}

export default function UserEditionModal({ isOpen, user, onCancel, onConfirm }: UserEditionModalProps) {
  const { t } = useTranslation()

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  })

  const { tSuccess, tError } = useToast()

  const [form, setForm] = useState<{ username: string; password: string; avatar: File | null }>({
    username: user?.username ?? '',
    password: '',
    avatar: null,
  })

  useEffect(() => {
    setForm({
      username: user?.username ?? '',
      password: '',
      avatar: null,
    })
  }, [isOpen])

  const mode = user ? 'update' : 'create'
  const title = user ? t('users.edition.edit_title') : t('users.edition.create_title')

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
          tError(t('status.error'), err.message)
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
          tError(t('status.error'), err.message)
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
      tSuccess(t('status.success'), t('users.feedbacks.created_ok'))
    } else if (mode === 'update' && user) {
      if (!(await userUpdate(user?.id, username, password, avatar))) {
        return
      }
      tSuccess(t('status.success'), t('users.feedbacks.updated_ok'))
    }

    onConfirm()
  }

  const handleCancel = () => {
    setErrors({
      username: '',
      password: '',
    })
    onCancel()
  }

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={title}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmText={t('users.edition.confirm')}
      cancelText={t('users.edition.cancel')}
    >
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
            label={t('users.edition.username')}
            placeholder={t('users.edition.username_placeholder')}
            value={form.username}
            onChange={(value) => setForm({ ...form, username: value })}
            type="text"
            name="username"
            error={errors.username}
          />

          <Input
            label={mode === 'create' ? t('users.edition.password') : t('users.edition.password_leave_empty')}
            placeholder={t('users.edition.password_placeholder')}
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
