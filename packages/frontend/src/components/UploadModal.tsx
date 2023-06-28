import { useRef, useState } from 'react'
import Modal from './Modal'

type UploadModalProps = {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => void
  allowedFormats?: string[]
}

export default function UploadModal({ open, onClose, onUpload, allowedFormats }: UploadModalProps) {
  const [error, setError] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const allowed = allowedFormats?.join(', ') ?? ''

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null)
      return
    }

    const file = e.target.files[0]
    if (!allowedFormats?.includes(file.type)) {
      setError('File format not allowed')
      return
    }

    setError('')
    setFile(file)
  }

  const submit = () => {
    if (file == null) {
      setError('No file selected')
      return
    }
    onUpload(file)
    close()
  }

  const close = () => {
    setError('')
    setFile(null)
    if (input.current) {
      input.current.value = ''
    }
    onClose()
  }

  return (
    <Modal
      isOpen={open}
      title="Add a new module from archive"
      onCancel={close}
      confirmEnabled={file != null}
      onConfirm={submit}
    >
      <div className="modal-body">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Pick a file</span>
            <span className="label-text-alt">{allowed} allowed</span>
          </label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept={allowed}
            onChange={handleUpload}
            ref={input}
          />
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        </div>
      </div>
    </Modal>
  )
}
