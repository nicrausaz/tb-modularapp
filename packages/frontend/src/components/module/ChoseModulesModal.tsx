import { Module } from '@/models/Module'
import ConfirmModal from '@/components/ConfirmModal'
import SearchBar from '@/components/SearchBar'
import ModuleSelectRow from './ModuleSelectRow'
import { useFetchAuth } from '@/hooks/useFetch'
import { useEffect, useRef, useState } from 'react'
import IconButton from '../IconButton'
import { AddSquareIcon } from '@/assets/icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type ConfirmModuleDeleteModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm(modules: Module[]): void
}

export default function ChoseModulesModal({ isOpen, onClose, onConfirm }: ConfirmModuleDeleteModalProps) {
  const { data, error, loading } = useFetchAuth<Module[]>('/api/modules')
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModules, setSelectedModules] = useState<Module[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { t } = useTranslation()

  const navigate = useNavigate()

  const searchFilters = [
    {
      label: t('modules.search_filters.all'),
      key: 'all',
    },
    {
      label: t('modules.search_filters.enabled'),
      key: 'enabled',
    },
    {
      label: t('modules.search_filters.disabled'),
      key: 'disabled',
    },
  ]

  const [searchFilter, setSearchFilter] = useState<string>('all')

  useEffect(() => {
    if (data) {
      setModules(data)
    }
  }, [data])

  useEffect(() => {
    if (data) {
      applySearchAndFilter(data)
    }
  }, [searchQuery, searchFilter])

  useEffect(() => {
    if (selectAll.current) {
      selectAll.current.indeterminate = !isAllChecked && selectedModules.length > 0
    }
  })

  const selectAll = useRef<HTMLInputElement>(null)

  if (!isOpen) {
    return null
  }

  const applySearchAndFilter = (modules: Module[]) => {
    let filteredModules = modules

    if (searchQuery) {
      filteredModules = filteredModules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (searchFilter !== 'all') {
      filteredModules = filteredModules.filter((module) => module.enabled === (searchFilter === 'enabled'))
    }

    setModules(filteredModules)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    throw error
  }

  const isAllChecked = modules.length === selectedModules.length

  const handleSelect = (module: Module, selected: boolean) => {
    if (!selected) {
      setSelectedModules(selectedModules.filter((m) => m.id !== module.id))
    } else {
      setSelectedModules([...selectedModules, module])
    }
  }

  const isSelected = (module: Module) => {
    return selectedModules.find((m) => m.id === module.id) !== undefined
  }

  const toggleSelectAll = () => {
    if (isAllChecked) {
      setSelectedModules([])
    } else {
      setSelectedModules(modules)
    }
  }

  const confirm = () => {
    onConfirm(selectedModules)
    setSelectedModules([])
  }

  const handleClose = () => {
    setSelectedModules([])
    onClose()
  }

  const ModuleTable = () => (
    <div className="modal-body">
      <div className="m-2">
        <SearchBar
          hasFilters={true}
          query={searchQuery}
          filters={searchFilters}
          currentFilter={searchFilter}
          onQueryChange={(query) => setSearchQuery(query)}
          onFilterChange={(filter) => setSearchFilter(filter)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={isAllChecked}
                    onChange={toggleSelectAll}
                    ref={selectAll}
                  />
                </label>
              </th>
              <th>{t('modules.information.name')}</th>
              <th>{t('modules.information.version')}</th>
              <th>{t('modules.information.status')}</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module, i) => (
              <ModuleSelectRow key={i} module={module} selected={isSelected(module)} onSelect={handleSelect} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <ConfirmModal
      isOpen={isOpen}
      title={t('modules.add_modal.add_title')}
      onConfirm={confirm}
      onCancel={handleClose}
      confirmEnabled={selectedModules.length > 0}
    >
      {data && data.length === 0 ? (
        <div className="mt-4 text-center text-xl text-gray-500 flex flex-col items-center gap-2">
          <span>{t('modules.add_modal.no_modules')}</span>
          <IconButton
            icon={<AddSquareIcon />}
            label={t('modules.add_modal.add_now')}
            position="left"
            className="btn-primary"
            onClick={() => navigate('/modules')}
          />
        </div>
      ) : (
        <ModuleTable />
      )}
    </ConfirmModal>
  )
}
