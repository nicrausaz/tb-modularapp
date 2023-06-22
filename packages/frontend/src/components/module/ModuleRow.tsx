import { useNavigate } from 'react-router-dom'
import ContextDropdown from '../ContextDropdown'
import { MoreDotsVertIcon } from '@/assets/icons'
import { Module } from '@/models/Module'

type ModuleCardProps = {
  module: Module
  onAction?: (type: string, id: string) => void
}

export default function ModuleRow({ module, onAction }: ModuleCardProps) {
  const navigate = useNavigate()

  const actions = [
    {
      label: 'Edit',
      onClick: () => onAction && onAction('edit', module.id),
    },
    {
      label: 'Delete',
      onClick: () => onAction && onAction('delete', module.id),
    },
  ]

  if (module.enabled) {
    actions.push({
      label: 'Disable',
      onClick: () => onAction && onAction('disable', module.id),
    })
  } else {
    actions.push({
      label: 'Enable',
      onClick: () => onAction && onAction('enable', module.id),
    })
  }

  const handleClick = () => {
    navigate(`/modules/${module.id}`)
  }

  const iconLink = module.icon ? `/api/box/static/module/${module.id}/${module.icon}` : '/assets/module_placeholder.svg'

  return (
    <tr className="cursor-pointer" onClick={handleClick}>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask w-12 h-12">
              <img src={iconLink} />
            </div>
          </div>
          <div>
            <div className="font-bold">{module.name}</div>
          </div>
        </div>
      </td>
      <td>{module.description}</td>
      <td>
        {module.author}
        <br />
        <span className="badge badge-ghost badge-sm">{module.version}</span>
      </td>
      <td>
        {module.enabled ? (
          <div className="badge badge-success badge-xs animate-pulse"></div>
        ) : (
          <div className="badge badge-error badge-xs"></div>
        )}
      </td>
      <th onClick={(e) => e.stopPropagation()}>
        <ContextDropdown icon={<MoreDotsVertIcon className="w-5 h-5" />} actions={actions} />
      </th>
    </tr>
  )
}
