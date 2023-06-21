import { Module } from '@/models/Module'
import { Link } from 'react-router-dom'

type ModuleSelectRowProps = {
  module: Module
  selected?: boolean
  onSelect(module: Module, selected: boolean): void
}

export default function ModuleSelectRow({ module, selected = false, onSelect }: ModuleSelectRowProps) {
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(module, event.target.checked)
  }

  return (
    <tr title={module.description}>
      <th>
        <label>
          <input type="checkbox" className="checkbox" defaultChecked={selected} onChange={handleSelect} />
        </label>
      </th>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask w-12 h-12">
              <img src="/assets/module_placeholder.svg" />
            </div>
          </div>
          <div>
            <div className="font-bold">{module.name}</div>
            <div className="text-sm opacity-50">{module.author}</div>
          </div>
        </div>
      </td>
      <td>{module.version}</td>
      <th>
        <div className="flex flex-row items-center">
          {module.enabled ? (
            <div className="badge badge-success badge-xs animate-pulse"></div>
          ) : (
            <div className="badge badge-error badge-xs"></div>
          )}
          <Link to={`/modules/${module.id}`} className="btn btn-ghost btn-xs ml-2">
            details
          </Link>
        </div>
      </th>
    </tr>
  )
}
