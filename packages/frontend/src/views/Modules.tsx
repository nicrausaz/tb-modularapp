import fetcher from '@/api/fetcher'
import { UploadIcon } from '@/assets/icons'
import Modal from '@/components/Modal'
import SearchBar from '@/components/SearchBar'
import ModuleCard from '@/components/module/ModuleCard'
import { useFetchAuth } from '@/hooks/useFetch'
import { Module } from '@/models/Module'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Modules() {
  const { data, error, loading } = useFetchAuth<Module[]>('/api/modules')
  const [modules, setModules] = useState<Module[]>([])
  const navigate = useNavigate()

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchFilter, setSearchFilter] = useState<string>('All')

  useEffect(() => {
    if (data) {
      setModules(data)
    }
  }, [data])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const searchFilters = [
    'All',
    'Enabled',
    'Disabled',
  ]



  const changeModuleStatus = async (id: string, enabled: boolean) => {
    const data = [...modules]
    const index = data.findIndex((module) => module.id === id)

    data[index].enabled = enabled
    setModules(data)
  }

  const handleAction = async (type: string, id: string) => {
    switch (type) {
      case 'enable':
        await fetcher(`/api/modules/${id}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enabled: true,
          }),
        })
        changeModuleStatus(id, true)
        break

      case 'disable':
        await fetcher(`/api/modules/${id}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enabled: false,
          }),
        })
        changeModuleStatus(id, false)
        break

      case 'delete':
        setConfirmDelete(true)
        // await fetcher(`/api/modules/${id}`, {
        //   method: 'DELETE',
        // })
        break

      case 'edit':
        navigate(`/modules/${id}`)
        break
    }
  }

  return (
    <div className="flex flex-col h-full pb-20">
      <h1 className="text-2xl font-bold">Modules</h1>

      <div className="my-4 flex gap-2">
        <SearchBar query={searchQuery} typeFilters={searchFilters} currentTypeFilter={searchFilter}/>
        
        <button className="btn border border-gray-300" onClick={() => setUploadModalOpen(true)}>
          <UploadIcon className="w-5 h-5" />
          Add
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 items-center">
        {modules.map((module, i) => (
          <ModuleCard
            key={i}
            id={module.id}
            title={module.name}
            description={module.description}
            active={module.enabled}
            onAction={handleAction}
          />
        ))}
      </div>

      <Modal isOpen={confirmDelete} title="Confirm deletion" onClose={() => setConfirmDelete(false)}>
        <div className="modal-body">
          <p>Are you sure you want to delete this module ?</p>
        </div>
      </Modal>

      <Modal isOpen={uploadModalOpen} title="Add a new module from archive" onClose={() => setUploadModalOpen(false)}>
        <div className="modal-body">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Pick a file</span>
              <span className="label-text-alt">.zip allowed</span>
            </label>
            <input type="file" className="file-input file-input-bordered w-full" accept=".zip" />
            <label className="label">
              <span className="label-text-alt text-error">Error label</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  )
}
