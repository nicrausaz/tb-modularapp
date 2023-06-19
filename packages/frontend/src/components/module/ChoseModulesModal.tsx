import { Module } from '@/models/Module'
import ConfirmModal from '../ConfirmModal'
import ModuleRow from './ModuleRow'
import { useFetchAuth } from '@/hooks/useFetch'
import { useEffect, useState } from 'react'
import SearchBar from '../SearchBar'

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
  const [searchFilter, setSearchFilter] = useState<string>('All')

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

  const applySearchAndFilter = (modules: Module[]) => {
    let filteredModules = modules

    if (searchQuery) {
      filteredModules = filteredModules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (searchFilter !== 'All') {
      filteredModules = filteredModules.filter((module) => module.enabled === (searchFilter === 'Enabled'))
    }

    setModules(filteredModules)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    throw error
  }

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

  const isAllChecked = modules.length === selectedModules.length

  const searchFilters = ['All', 'Enabled', 'Disabled']

  return (
    <ConfirmModal
      isOpen={isOpen}
      title="Select a module to add to the screen"
      onConfirm={() => onConfirm(selectedModules)}
      onClose={onClose}
      confirmEnabled={selectedModules.length > 0}
    >
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
                    <input type="checkbox" className="checkbox" defaultChecked={isAllChecked} />
                  </label>
                </th>
                <th>Name</th>
                <th>Version</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module, i) => (
                <ModuleRow key={i} module={module} selected={isSelected(module)} onSelect={handleSelect} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ConfirmModal>
  )
}
