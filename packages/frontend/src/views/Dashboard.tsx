import { useEffect, useState } from 'react'
// import ModuleRender from '@/components/module/ModuleRender'
import { useFetchAuth } from '@/hooks/useFetch'
import { Screen } from '@/models/Screen'
import ScreenToolbar from '@/components/screens/ScreenToolbar'
import fetcher from '@/api/fetcher'
import LoadingTopBar from '@/components/LoadingTopBar'
import ErrorPage from './Error'
import { Navigate } from 'react-router-dom'

export default function Dashboard() {
  const { data, error, loading } = useFetchAuth<Screen[]>('/api/screens')

  const [screen, setScreen] = useState<Screen | null>(null)

  useEffect(() => {
    if (data) {
      setScreen(data[0])
    }
  }, [data])


  const createScreen = async (name: string) => {
    // TODO: API call
    console.log('create screen', name)

    const newId = data!.length + 1

    const newScreen = await fetcher(`/api/screens/${newId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        name,
        enabled: true,
        slots: [],
      }),
    })

    console.log(newScreen)

    setScreen({
      id: data!.length + 1,
      name,
      enabled: true,
      slots: [],
    })
  }

  if (loading) {
    return <LoadingTopBar />
  }

  if (error) {
    throw error
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <div className="flex flex-col h-full pb-20">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="p-4">
        <ScreenToolbar
          currentScreen={screen!}
          screens={data}
          onScreenSelection={setScreen}
          onScreenAdd={createScreen}
        />

        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          {/* {data &&
            data.map((module) => (
              <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50" key={module.id}>
                <div className="w-full h-full">
                  <ModuleRender key={module.id} id={module.id} />
                </div>
              </div>
            ))} */}
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
