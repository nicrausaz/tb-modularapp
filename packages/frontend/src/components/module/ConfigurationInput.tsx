import { ConfigurationEntry } from '@/models/Configuration'

type ConfigurationInputProps = {
  input: ConfigurationEntry
  onValueChange: (name: string, value: string | number | boolean) => void
}

export default function ConfigurationInput({ input, onValueChange }: ConfigurationInputProps) {
  const placeholder = input.placeholder ?? 'Type here'
  const displayedValue = input.value?.toString() ?? ''

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (input.type === 'bool') {
      return onValueChange(event.target.name, (event.target as HTMLInputElement).checked)
    }
    onValueChange(event.target.name, event.target.value)
  }

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
          onChange={handleChange}
        />
      )}
      {input.type === 'number' && (
        <input
          name={input.name}
          type="number"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={displayedValue}
          onChange={handleChange}
        />
      )}
      {input.type === 'bool' && (
        <input
          name={input.name}
          type="checkbox"
          className="checkbox"
          placeholder={placeholder}
          checked={input.value as boolean}
          onChange={handleChange}
          value="true"
        />
      )}
      {input.type === 'option' && (
        <select className="select select-bordered w-full" onChange={handleChange} name={input.name}>
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
