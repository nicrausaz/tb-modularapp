import { Link } from 'react-router-dom'
import ContextDropdown from '../ContextDropdown'
import { MoreDotsVertIcon } from '@/assets/icons'
import { Module } from '@/models/Module'

type ModuleCardProps = {
  module: Module
  onAction?: (type: string, id: string) => void
}

export default function ModuleCard({ module, onAction }: ModuleCardProps) {
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

  return (
    <div className="card card-side bg-base-200 shadow-xl disabled">
      <div className="absolute -translate-y-2">
        {module.enabled ? (
          <div className="badge badge-success badge-xs animate-pulse"></div>
        ) : (
          <div className="badge badge-error badge-xs"></div>
        )}
      </div>
      <Link className="card-body flex flex-row items-center" title={module.description} to={`/modules/${module.id}`}>
        <img className="mask" src="/assets/module_placeholder.svg" width={100} height={100} />
        <div>
          {module.nickname ? (
            <h2 className="card-title">
              {module.nickname} <span className='text-sm italic text-neutral'>({module.name})</span>
            </h2>
          ) : (
            <h2 className="card-title">{module.name}</h2>
          )}

          <p className="mb-2">{module.description}</p>
          <div className="flex items-center space-x-2 ml-2">
            <span className="text-sm">{module.author}</span>
            <span className="badge badge-sm">{module.version}</span>
          </div>
          <div className="card-actions justify-end"></div>
        </div>
      </Link>
      <div>
        <div className="justify-end translate-x-2 -translate-y-2">
          <ContextDropdown icon={<MoreDotsVertIcon className="w-5 h-5" />} actions={actions} />
        </div>
      </div>
    </div>
  )
}
