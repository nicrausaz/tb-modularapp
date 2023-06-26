import { User, UserCreate } from '@/models/User'
import ConfirmModal from '@/components/ConfirmModal'
import FilePreviewerInput from '@/components/FilePreviewerInput'
import { useState } from 'react'
import Input from '@/components/Input'
import fetcher from '@/api/fetcher'
import { useToast } from '@/contexts/ToastContext'

type UserEditionModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm(action: 'create' | 'update', user: UserCreate): void
  user: User | null
}

export default function UserEditionModal({ isOpen, user, onClose, onConfirm }: UserEditionModalProps) {
  const mode = user ? 'update' : 'create'
  const title = user ? 'Edit user' : 'Create user'

  const [username, setUsername] = useState<string>(user?.username ?? '')
  const [password, setPassword] = useState<string>('')

  const { tSuccess } = useToast()

  const handleConfirm = async () => {
    const newUser: UserCreate = {
      username,
      password,
    }

    if (mode === 'update' && user) {
      newUser.id = user.id
    }

    if (mode === 'create') {
      await fetcher('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
      tSuccess('Success', 'User created')
    } else if (mode === 'update') {

      // TODO: Update picture


      await fetcher(`/api/users/${newUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
      tSuccess('Success', 'User updated')
    }

    // onConfirm(mode, newUser)
  }

  const uploadPicture = (file: File) => {
    console.log('upload picture', file)
  }

  const cleanAndClose = () => {
    setUsername('')
    setPassword('')
    onClose()
  }

  return (
    <ConfirmModal isOpen={isOpen} title={title} onConfirm={handleConfirm} onClose={cleanAndClose}>
      <div className="modal-body">
        <div className="form-control">
          {mode === 'update' && (
            <div className="mx-auto">
              <FilePreviewerInput
                onUpload={() => {
                  uploadPicture
                }}
                allowedFormats={['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']}
                className="w-32 h-32"
              />
            </div>
          )}

          <Input
            label="Username"
            placeholder="Type a username..."
            value={username}
            onChange={(value) => setUsername(value)}
            type="text"
            name="username"
            error=""
          />

          <Input
            label="Password"
            placeholder="Type a password..."
            value={password}
            onChange={(value) => setPassword(value)}
            type="password"
            name="password"
            error=""
          />
        </div>
      </div>
    </ConfirmModal>
  )
}
