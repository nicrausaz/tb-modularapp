import { useState, useRef } from 'react'

type FilePreviewerInputProps = {
  onUpload(file: File): void
  allowedFormats?: string[]
  currentPicture?: string
}

/**
 * File input with preview
 */
export default function FilePreviewerInput({ onUpload, allowedFormats }: FilePreviewerInputProps) {
  const [error, setError] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const allowed = allowedFormats?.join(', ') ?? ''

  const preview = file ? URL.createObjectURL(file) : '/assets/placeholder.svg'

  const openFilePicker = () => {
    if (input.current) {
      input.current.click()
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (allowedFormats && !allowedFormats.includes(file.type)) {
        setError(`File type not allowed. Allowed types: ${allowed}`)
        return
      }
      setError('')
      setFile(file)
      onUpload(file)
    }
  }

  return (
    <div
      className="rounded-full h-36 w-36 mx-auto cursor-pointer bg-cover bg-center border"
      style={{ backgroundImage: `url(${preview})` }}
      onClick={openFilePicker}
    >
      <input type="file" className="hidden" id="file-input" accept={allowed} ref={input} onChange={handleFile} />
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    </div>
  )
}
