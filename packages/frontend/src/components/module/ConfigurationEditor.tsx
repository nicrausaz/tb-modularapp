import { Configuration } from '@/models/Configuration'
import ConfigurationInput from './ConfigurationInput'
import { useState } from 'react'

type ConfigurationEditorProps = {
  configuration: Configuration
  onSave: (configuration: Configuration) => void
}

export default function ConfigurationEditor({ configuration, onSave }: ConfigurationEditorProps) {
  const [editingConfig, setEditingConfig] = useState<Configuration>(configuration)

  const handleInputChange = (name: string, value: string | boolean | number ) => {
    setEditingConfig((prev) => {
      const newConfig = [...prev]
      const index = newConfig.findIndex((config) => config.name === name)
      newConfig[index].value = value
      return newConfig
    })
  }

  const handleSave = () => {
    // TODO: perform validation
    onSave(editingConfig)
  }

  return (
    <div className="form-control w-full">
      {configuration.map((input, i) => [
        <ConfigurationInput input={input} key={i} onValueChange={handleInputChange} />,
        <div className="divider m-0" key={`divider${i}`}></div>,
      ])}

      <div className="flex items-center justify-end gap-2 mt-2">
        <button className="btn btn-primary">Reset to default</button>
        <button className="btn btn-error" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  )
}
