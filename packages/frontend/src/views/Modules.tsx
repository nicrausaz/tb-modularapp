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
import { disable, enable, remove, upload } from '@/api/requests/module'

export default function Modules() {
  const { data, error, loading } = useFetchAuth<Module[]>('/api/modules')
  const [modules, setModules] = useState<Module[]>([])
  const navigate = useNavigate()

  const [preferedLayout, setPreferedLayout, _] = useLocalStorage('modules-layout', 'grid')
  const [selectedLayout, setSelectedLayout] = useState<string>(preferedLayout)

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const { t } = useTranslation()

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
    }
  ]

  const [searchFilter, setSearchFilter] = useState<string>(searchFilters[0].key)

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

  if (loading) {
    return <LoadingTopBar />
  }

  if (error) {
    throw error
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
    const req = enabled ? enable(id) : disable(id)
    req
      .then(() => {
        changeModuleStatus(id, enabled)
        tSuccess(t('status.success'), enabled ? t('module.feedbacks.enabled_ok') : t('module.feedbacks.disabled_ok'))
      })
      .catch((err) => tError(t('status.error'), err.message))
  }

  const handleDelete = async (id: string) => {
    setConfirmDelete(false)
    await remove(id)
    setModules(modules.filter((module) => module.id !== id))
    tSuccess(t('status.success'), t('module.feedbacks.deleted_ok'))
  }

  const handleUpload = async (file: File) => {
    upload(file)
      .then(({ moduleId }) => {
        tSuccess(t('status.success'), t('module.feedbacks.uploaded_ok'), `/modules/${moduleId}`)
        fetcher<Module[]>(`/api/modules`).then((res) => setModules(res || []))
      })
      .catch((err) => tError(t('status.error'), err.message))
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
          className={`btn-neutral ${modules.length ? '' : ' animate-wiggle'}`}
          label={t('modules.add')}
          position={'left'}
        />
      </div>
      <hr />
      <div className="my-4">
        {modules.length === 0 && <p className="text-center text-gray-500 mt-10">{t('modules.search_no_results')}</p>}

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
