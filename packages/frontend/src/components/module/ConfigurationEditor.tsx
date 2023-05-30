import { Configuration } from '@/models/Configuration'
import ConfigurationInput from './ConfigurationInput'

type ConfigurationEditorProps = {
  configuration: Configuration
}

export default function ConfigurationEditor({ configuration }: ConfigurationEditorProps) {
  return (
    <div className="form-control w-full">
      {configuration.map((input, i) => [
        <ConfigurationInput input={input} key={i} />,
        <div className="divider m-0" key={`divider${i}`}></div>,
      ])}

      <div className="flex items-center justify-end gap-2 mt-2">
        <button className="btn btn-primary">Reset to default</button>
        <button className="btn btn-error">Save</button>
      </div>
    </div>
  )
}
