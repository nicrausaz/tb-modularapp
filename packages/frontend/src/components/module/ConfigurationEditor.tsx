import { useState } from 'react'
import { Configuration } from '@/models/Configuration'
import ConfigurationInput from '@/components/module/ConfigurationInput'
import IconButton from '@/components/IconButton'
import { SaveIcon } from '@/assets/icons'

type ConfigurationEditorProps = {
  configuration: Configuration
  onSave: (configuration: Configuration) => void
  onReset: () => void
}

export default function ConfigurationEditor({ configuration, onSave, onReset }: ConfigurationEditorProps) {
  const [editingConfig, setEditingConfig] = useState<Configuration>([...configuration])

  const handleInputChange = (name: string, value: string | boolean | number) => {
    setEditingConfig((prev) => {
      const newConfig = [...prev]
      const index = newConfig.findIndex((config) => config.name === name)
      newConfig[index].value = value
      return newConfig
    })
  }

  return (
    <div className="form-control w-full">
      {configuration.map((input, i) => [
        <ConfigurationInput input={input} key={i} onValueChange={handleInputChange} />,
        <div className="divider m-0" key={`divider${i}`}></div>,
      ])}

      <div className="flex items-center justify-end gap-2 mt-2">
        <button className="btn" onClick={onReset}>
          Reset to default
        </button>
        <IconButton
          onClick={() => onSave(editingConfig)}
          icon={<SaveIcon className="w-4 h-4" />}
          position="left"
          label="Save"
          className="btn-primary"
          keepLabel={true}
        />
      </div>
    </div>
  )
}
