import { useEffect, useState } from 'react'
import ModuleRender from '@/components/module/ModuleRender'

export default function Dashboard() {
  // tmp
  const [modules, setModules] = useState<any[]>([])
  const getModules = async () => {
    const modules = await fetch('/api/modules')
    const data = await modules.json()
    setModules(data)
  }

  useEffect(() => {
    // Load modules
    getModules()
  }, [])

  return (
    <div className="flex flex-col h-full pb-20">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 items-center">
        {modules.map((module) => (
          <ModuleRender key={module.id} id={module.id} />
        ))}
      </div>
      <div className="p-4 ">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50">
            <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50">
            <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
