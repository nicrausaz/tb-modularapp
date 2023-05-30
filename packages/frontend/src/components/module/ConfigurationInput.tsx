import { ConfigurationEntry } from '@/models/Configuration'

type ConfigurationInputProps = {
  input: ConfigurationEntry
}

export default function ConfigurationInput({ input }: ConfigurationInputProps) {
  const placeholder = input.placeholder ?? 'Type here'
  const displayedValue = input.value?.toString() ?? ''

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(event.target.value)
  }

  return (
    <>
      <label className="label">
        <span className="label-text">{input.label}</span>
      </label>
      {input.type === 'text' && (
        <input
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={displayedValue}
          onChange={handleChange}
        />
      )}
      {input.type === 'number' && (
        <input
          type="number"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={displayedValue}
          onChange={handleChange}
        />
      )}
      {input.type === 'bool' && (
        <input
          type="checkbox"
          className="checkbox"
          placeholder={placeholder}
          checked={input.value as boolean}
          onChange={handleChange}
        />
      )}
      {input.type === 'option' && (
        <select className="select select-bordered w-full" onChange={handleChange}>
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
