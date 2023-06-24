import { User, UserCreate } from '@/models/User'
import ConfirmModal from '@/components/ConfirmModal'
import FilePreviewerInput from '@/components/FilePreviewerInput'
import { useState } from 'react'

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

  const handleConfirm = () => {
    const newUser: UserCreate = {
      username,
      password,
    }

    if (mode === 'update' && user) {
      newUser.id = user.id
    }

    onConfirm(mode, newUser)
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
          <FilePreviewerInput
            onUpload={() => {
              uploadPicture
            }}
            allowedFormats={['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']}
          />
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Type a username..."
            className="input input-bordered"
            defaultValue={user?.username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Type a password..."
            className="input input-bordered"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
    </ConfirmModal>
  )
}
