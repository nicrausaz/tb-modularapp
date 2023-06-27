type InputProps = {
  label?: string
  type?: 'text' | 'password' | 'email' | 'number'
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  props?: React.InputHTMLAttributes<HTMLInputElement>
}

/**
 * A wrapper around the input element
 * Can display a label and an error message
 */
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  name,
  placeholder,
  disabled,
  className,
  props,
}: InputProps) {
  const labelClasses = `label-text ${error ? 'text-error' : ''}`
  const inputClasses = `input input-bordered ${className} ${error ? 'border border-error text-error' : ''}`
  return (
    <>
      {label && (
        <label className="label">
          <span className={labelClasses}>{label}</span>
        </label>
      )}
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClasses}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      <label className="label">
        <span className="label-text-alt text-error">{error}</span>
      </label>
    </>
  )
}
