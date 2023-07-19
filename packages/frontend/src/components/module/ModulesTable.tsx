import { Module } from '@/models/Module'
import ModuleRow from './ModuleRow'
import { useTranslation } from 'react-i18next'

type ModulesTableProps = {
  modules: Module[]
  onAction?: (type: string, id: string) => void
}

export default function ModulesTable({ modules, onAction }: ModulesTableProps) {
  const { t } = useTranslation()
  return (
    <div className="overflow-none">
      <table className="table">
        <thead>
          <tr>
            <th>{t('modules.information.name')}</th>
            <th>{t('modules.information.description')}</th>
            <th className="hidden md:table-cell">{t('modules.information.infos')}</th>
            <th>{t('modules.information.status')}</th>
            <th>{t('modules.information.actions')}</th>
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
