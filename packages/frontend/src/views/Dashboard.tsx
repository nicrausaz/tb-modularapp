import { useEffect, useState } from 'react'
import { useFetchAuth } from '@/hooks/useFetch'
import { Screen } from '@/models/Screen'
import ScreenToolbar from '@/components/screens/ScreenToolbar'
import fetcher from '@/api/fetcher'
import LoadingTopBar from '@/components/LoadingTopBar'
import ScreenEditor from '@/components/screens/ScreenEditor'
import ChoseModulesModal from '@/components/module/ChoseModulesModal'

export default function Dashboard() {
  const { data, error, loading } = useFetchAuth<Screen[]>('/api/screens')

  const [screen, setScreen] = useState<Screen | null>(null)
  const [modulesModalOpen, setModulesModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      setScreen(data[0])
    }
  }, [data])

  const createScreen = async (name: string) => {
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

  const saveScreen = async (screen: Screen) => {
    await fetcher(`/api/screens/${screen.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(screen),
    })
  }

  const handleLayoutChange = (slots: Screen[]) => {
    console.log('HANDLE', slots[0])
  }

  const addModulesToScreen = (modules: string[]) => {
    setModulesModalOpen(false)
    console.log('ADD', modules)
    modules.forEach((m) => screen?.slots.push(m))
  }

  if (loading) {
    return <LoadingTopBar />
  }

  if (error) {
    throw error
  }

  if (!data || !screen) {
    return null
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div>
        <ScreenToolbar
          currentScreen={screen}
          screens={data}
          onScreenSelection={setScreen}
          onScreenAdd={createScreen}
          onSave={saveScreen}
          onSlotAdd={() => setModulesModalOpen(true)}
        />
        <ScreenEditor slots={screen.slots} onChange={handleLayoutChange} />
      </div>
      <ChoseModulesModal isOpen={modulesModalOpen} onClose={() => setModulesModalOpen(false)} onConfirm={addModulesToScreen} />
    </div>
  )
}
