import { useEffect, useState } from 'react'
import ModuleRender from '@/components/module/ModuleRender'
import { useFetchAuth } from '@/hooks/useFetch'
import { Module } from '@/models/Module'
import { NewScreenIcon, OpenNewTabIcon } from '@/assets/icons'
import { Link } from 'react-router-dom'

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
      <div className="p-4">
        <div className="border w-full rounded-lg shadow flex justify-between items-center bg-slate-500 p-2 mb-4">
          <div>
            <input type="text" className="w-full px-4 py-2 rounded-lg input-md" placeholder="Screen name..." />
          </div>
          <div>
            <div className="dropdown dropdown-end mr-2">
              <label tabIndex={0} className="btn m-1">
                Screen 1
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a>Screen 2</a>
                </li>
                <li className='border-t mt-2 pt-2'>
                  <a>
                    <NewScreenIcon className="w-4 h-4" />
                    Add new screen
                    </a>
                </li>
              </ul>
            </div>
            <Link className="btn btn-info" to={'/visualize/1'} target="_blank">
              Preview
              <OpenNewTabIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          {data &&
            data.map((module) => (
              <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50" key={module.id}>
                <div className="w-full h-full">
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
