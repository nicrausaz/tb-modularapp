import { Link } from 'react-router-dom'
import ModuleContextDropdown from './ModuleContextDropdown'

type ModuleCardProps = {
  id: string
  title: string
  description: string
  active: boolean
  onAction?: (type: string, id: string) => void
}

export default function ModuleCard({ id, title, description, active, onAction }: ModuleCardProps) {
  const actions = [
    {
      label: 'Edit',
      onClick: () => onAction && onAction('edit', id),
    },
    {
      label: 'Delete',
      onClick: () => onAction && onAction('delete', id),
    },
  ]

  if (active) {
    actions.push({
      label: 'Disable',
      onClick: () => onAction && onAction('disable', id),
    })
  } else {
    actions.push({
      label: 'Enable',
      onClick: () => onAction && onAction('enable', id),
    })
  }

  const disabledStyle = active ? {} : { filter: 'opacity(0.7)' }

  return (
    <div className="card card-side bg-base-200 shadow-xl disabled" style={disabledStyle}>
      <Link className="card-body flex flex-row items-center" title={description} to={`/modules/${id}`}>
        <img className="mask" src="/assets/module_placeholder.svg" width={100} height={100} />
        <div>
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end"></div>
        </div>
      </Link>
      <div>
        <div className="justify-end translate-x-2 -translate-y-2">
          <ModuleContextDropdown actions={actions} />
        </div>
      </div>
    </div>
  )
}
