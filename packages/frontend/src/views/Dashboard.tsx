import { useEffect, useState } from 'react'
import ModuleRender from '@/components/module/ModuleRender'
import { useFetchAuth } from '@/hooks/useFetch'
import { Module } from '@/models/Module'

export default function Dashboard() {
  const { data, error, loading } = useFetchAuth<Module[]>('/api/modules')

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex flex-col h-full pb-20">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 items-center"></div>
      <div className="p-4">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          {data &&
            data.map((module) => (
              <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50" key={module.id}>
                <div className='w-full h-full'>
                  <ModuleRender key={module.id} id={module.id} />
                </div>
              </div>
            ))}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28">
              <p className="text-2xl text-gray-400">+</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50">
            <p className="text-2xl text-gray-400 ">+</p>
          </div>
        </div>
      </div>
    </div>
  )
}
