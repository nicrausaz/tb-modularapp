import fetcher from '@/api/fetcher'
import { GridIcon, ListIcon, UploadIcon } from '@/assets/icons'
import LoadingTopBar from '@/components/LoadingTopBar'
import SearchBar from '@/components/SearchBar'
import UploadModal from '@/components/UploadModal'
import ConfirmModuleDeleteModal from '@/components/module/ConfirmModuleDeleteModal'
import ModuleCard from '@/components/module/ModuleCard'
import { useToast } from '@/contexts/ToastContext'
import { useFetchAuth } from '@/hooks/useFetch'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Module } from '@/models/Module'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import IconButton from '@/components/IconButton'
import ModulesTable from '@/components/module/ModulesTable'

export default function Modules() {
  const { data, error, loading } = useFetchAuth<Module[]>('/api/modules')
  const [modules, setModules] = useState<Module[]>([])
  const navigate = useNavigate()

  const [preferedLayout, setPreferedLayout, _] = useLocalStorage('modules-layout', 'grid')

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchFilter, setSearchFilter] = useState<string>('All')
  const [selectedLayout, setSelectedLayout] = useState<string>(preferedLayout)

  const { t } = useTranslation()
  const { tSuccess, tError } = useToast()

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
    return <LoadingTopBar />
  }

  if (error) {
    throw error
  }

  const searchFilters = ['All', 'Enabled', 'Disabled']

  const changeModuleStatus = async (id: string, enabled: boolean) => {
    const data = [...modules]
    const index = data.findIndex((module) => module.id === id)

    data[index].enabled = enabled
    setModules(data)
  }

  const handleAction = async (type: string, id: string) => {
    let mod
    switch (type) {
      case 'enable':
        handleStatusChange(id, true)
        break

      case 'disable':
        handleStatusChange(id, false)
        break

      case 'delete':
        mod = modules.find((module) => module.id === id)
        if (!mod) return

        setModuleToDelete(mod)
        setConfirmDelete(true)
        break

      case 'edit':
        navigate(`/modules/${id}`)
        break
    }
  }

  const handleStatusChange = async (id: string, enabled: boolean) => {
    await fetcher(`/api/modules/${id}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enabled,
      }),
    })
    changeModuleStatus(id, enabled)
  }

  const handleDelete = async (id: string) => {
    setConfirmDelete(false)
    await fetcher(`/api/modules/${id}`, {
      method: 'DELETE',
    })

    setModules(modules.filter((module) => module.id !== id))
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    fetcher<{ moduleId: string }>('/api/modules', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        tSuccess('Success', 'Module uploaded successfully', `/modules/${res.moduleId}`)
        fetcher<Module[]>(`/api/modules`).then((res) => setModules(res || []))
      })
      .catch((err) => {
        tError('Error', err.message)
      })
      .finally(() => {
        setUploadModalOpen(false)
      })
  }

  const toggleLayout = () => {
    const newLayout = selectedLayout === 'grid' ? 'list' : 'grid'
    setSelectedLayout(newLayout)
    setPreferedLayout(newLayout)
  }

  return (
    <div className="flex flex-col h-full pb-20 mx-4">
      <div className="my-4 flex gap-2">
        <SearchBar
          hasFilters={true}
          query={searchQuery}
          filters={searchFilters}
          currentFilter={searchFilter}
          onQueryChange={(query) => setSearchQuery(query)}
          onFilterChange={(filter) => setSearchFilter(filter)}
        />

        <label className="btn border border-gray-300 swap swap-rotate">
          <input type="checkbox" onChange={toggleLayout} />
          <GridIcon className="w-6 h-6 swap-on" />
          <ListIcon className="w-6 h-6 swap-off" />
        </label>

        <IconButton
          icon={<UploadIcon className="w-5 h-5" />}
          onClick={() => setUploadModalOpen(true)}
          className="border border-gray-300"
          label="Add"
          position={'left'}
        />
      </div>
      <hr />
      <div className="my-4">
        {modules.length === 0 && <p className="text-center text-neutral mt-10">{t('modules.search_no_results')}</p>}

        {modules.length && selectedLayout === 'list' ? (
          <ModulesTable modules={modules} onAction={handleAction} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} onAction={handleAction} />
            ))}
          </div>
        )}
      </div>

      {moduleToDelete && (
        <ConfirmModuleDeleteModal
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDelete}
          module={moduleToDelete}
        />
      )}

      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
        allowedFormats={['application/zip']}
      />
    </div>
  )
}
