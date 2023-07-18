import { ConfigurationEntry } from '@/models/Configuration'

type ConfigurationInputProps = {
  input: ConfigurationEntry
  onValueChange: (name: string, value: string | number | boolean) => void
}

export default function ConfigurationInput({ input, onValueChange }: ConfigurationInputProps) {
  const placeholder = input.placeholder ?? 'Type here'
  const displayedValue = input.value?.toString() ?? ''

  return (
    <>
      <label className="label">
        <span className="label-text">{input.label}</span>
      </label>
      {input.type === 'text' && (
        <input
          name={input.name}
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={displayedValue}
          onChange={(e) => onValueChange(e.target.name, e.target.value)}
        />
      )}
      {input.type === 'number' && (
        <input
          name={input.name}
          type="number"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={displayedValue}
          onChange={(e) => onValueChange(e.target.name, parseInt(e.target.value))}
        />
      )}
      {input.type === 'bool' && (
        <input
          name={input.name}
          type="checkbox"
          className="checkbox"
          placeholder={placeholder}
          checked={input.value as boolean}
          onChange={(e) => onValueChange(e.target.name, e.target.checked)}
          value="true"
        />
      )}
      {input.type === 'option' && (
        <select
          className="select select-bordered w-full"
          onChange={(e) => onValueChange(e.target.name, e.target.value)}
          name={input.name}
        >
          {input.options &&
            input.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
        </select>
      )}
      <label className="label">
        <span className="label-text-alt text-gray-500">{input.description}</span>
      </label>
    </>
  )
}
