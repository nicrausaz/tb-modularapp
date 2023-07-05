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

  const handleClick = () => {
    onSelect(module, !selected)
  }

  const iconLink = module.icon ? `/api/box/static/module/${module.id}/${module.icon}` : '/assets/module_placeholder.svg'

  return (
    <tr title={module.description} onClick={handleClick} className="cursor-pointer">
      <th>
        <label>
          <input type="checkbox" className="checkbox" checked={selected} onChange={handleSelect} />
        </label>
      </th>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask w-12 h-12">
              <img src={iconLink} />
            </div>
          </div>
          <div>
            <div className="font-bold">{module.nickname ? `${module.nickname} (${module.name})` : module.name}</div>
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
