import { Module } from '@/models/Module'
import ModuleRow from './ModuleRow'

type ModulesTableProps = {
  modules: Module[]
  onAction?: (type: string, id: string) => void
}

export default function ModulesTable({ modules, onAction }: ModulesTableProps) {
  return (
    <div className=" overflow-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th className="hidden md:table-cell">Infos</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module) => (
            <ModuleRow key={module.id} module={module} onAction={onAction} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
