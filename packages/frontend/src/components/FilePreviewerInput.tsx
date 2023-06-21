import { useState, useRef } from 'react'

type FilePreviewerInputProps = {
  onUpload(file: File): void
  allowedFormats?: string[]
  currentPicture?: string
}
// TODO
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

  return (
    <div
      className="rounded-full h-36 w-36 mx-auto cursor-pointer bg-cover bg-center border"
      style={{ backgroundImage: preview }}
      onClick={openFilePicker}
    >
      <input type="file" className="hidden" id="file-input" accept={allowed} ref={input} />
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    </div>
  )
}
