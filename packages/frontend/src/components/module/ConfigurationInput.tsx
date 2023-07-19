import { EyeClosedIcon, EyeOpenIcon } from '@/assets/icons'
import { ConfigurationEntry } from '@/models/Configuration'
import Input from '../Input'

type ConfigurationInputProps = {
  input: ConfigurationEntry
  error?: string
  onValueChange: (name: string, value: string | number | boolean) => void
}

export default function ConfigurationInput({ input, error, onValueChange }: ConfigurationInputProps) {
  const placeholder = input.placeholder ?? 'Type here'
  const displayedValue = input.value?.toString() ?? ''

  const toggleView = (name: string) => {
    const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement
    if (input.type === 'password') {
      input.type = 'text'
    } else {
      input.type = 'password'
    }
  }

  const labelClass = error ? 'label-text text-error' : 'label-text'

  return (
    <>
      <label className="label">
        <span className={labelClass}>{input.label}</span>
      </label>
      {input.type === 'text' && (
        <Input
          name={input.name}
          type="text"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={displayedValue}
          onChange={(val) => onValueChange(input.name, val)}
          error={error}
        />
      )}
      {input.type === 'number' && (
        <Input
          name={input.name}
          type="number"
          placeholder={placeholder}
          className="input input-bordered w-full"
          value={displayedValue}
          onChange={(val) => onValueChange(input.name, parseInt(val))}
          error={error}
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
          defaultValue={input.value as string}
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
      {input.type === 'secret' && (
        <div className="join">
          <input
            name={input.name}
            type="password"
            placeholder={placeholder}
            className="input input-bordered w-full join-item"
            value={displayedValue}
            onChange={(e) => onValueChange(e.target.name, e.target.value)}
          />

          <label className="btn border border-gray-300 join-item swap">
            <input type="checkbox" onChange={() => toggleView(input.name)} />
            <EyeClosedIcon className="w-5 h-5 swap-off" />
            <EyeOpenIcon className="w-5 h-5 swap-on" />
          </label>
        </div>
      )}
      <label className="label">
        <span className="label-text-alt text-gray-500">{input.description}</span>
      </label>
    </>
  )
}
