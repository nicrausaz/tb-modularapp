import { useEffect, useState } from 'react'
import { useFetchAuth } from '@/hooks/useFetch'
import { Screen } from '@/models/Screen'
import ScreenToolbar from '@/components/screens/ScreenToolbar'
import fetcher from '@/api/fetcher'
import LoadingTopBar from '@/components/LoadingTopBar'
import ScreenEditor from '@/components/screens/ScreenEditor'
import ChoseModulesModal from '@/components/module/ChoseModulesModal'
import ConfirmScreenDeleteModal from '@/components/screens/ConfirmScreenDeleteModal'

export default function Dashboard() {
  const { data, error, loading } = useFetchAuth<Screen[]>('/api/screens')

  const [screen, setScreen] = useState<Screen | null>(null)
  const [modulesModalOpen, setModulesModalOpen] = useState<boolean>(false)
  const [deleteScreenModalOpen, setDeleteScreenModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      setScreen(data[0])
    }
  }, [data])

  const createScreen = async (name: string) => {
    const newId = data!.reduce((biggest, screen) => (screen.id > biggest ? screen.id : biggest), 1)

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

    setScreen({
      id: data!.length + 1,
      name,
      enabled: true,
      slots: [],
    })
  }

  const saveScreen = async (screen: Screen) => {
    console.log('SAVE', screen)
    setScreen({
      ...screen,
    })
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

  const deleteScreen = async (screenId: number) => {
    setDeleteScreenModalOpen(false)
    await fetcher(`/api/screens/${screen?.id}`, {
      method: 'DELETE',
    })
    setScreen(null)
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
          onNameChange={(name) => setScreen({ ...screen, name })}
          onScreenSelection={setScreen}
          onScreenAdd={createScreen}
          onSave={saveScreen}
          onSlotAdd={() => setModulesModalOpen(true)}
          onDelete={() => setDeleteScreenModalOpen(true)}
        />
        <ScreenEditor slots={screen.slots} onChange={handleLayoutChange} />
      </div>
      <ChoseModulesModal
        isOpen={modulesModalOpen}
        onClose={() => setModulesModalOpen(false)}
        onConfirm={addModulesToScreen}
      />
      <ConfirmScreenDeleteModal
        isOpen={deleteScreenModalOpen}
        onClose={() => setDeleteScreenModalOpen(false)}
        onConfirm={deleteScreen}
        screen={screen}
      />
    </div>
  )
}
