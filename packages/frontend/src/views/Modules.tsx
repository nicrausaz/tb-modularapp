import fetcher from '@/api/fetcher'
import Modal from '@/components/Modal'
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

      <div className="my-4">
        <div className="join w-full shadow">
          <div className="flex-grow">
            <div>
              <input className="input input-bordered  join-item w-full" placeholder="Search..." />
            </div>
          </div>
          <select className="select select-bordered join-item flex-grow-0">
            <option selected>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button className="btn join-item flex-grow-0 border border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
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
    </div>
  )
}
