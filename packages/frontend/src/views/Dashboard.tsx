import { useEffect, useState } from 'react'
import { useFetchAuth } from '@/hooks/useFetch'
import { Screen, ScreenSlot } from '@/models/Screen'
import ScreenToolbar from '@/components/screens/ScreenToolbar'
import fetcher from '@/api/fetcher'
import LoadingTopBar from '@/components/LoadingTopBar'
import ScreenEditor from '@/components/screens/ScreenEditor'
import ChoseModulesModal from '@/components/module/ChoseModulesModal'
import ConfirmScreenDeleteModal from '@/components/screens/ConfirmScreenDeleteModal'
import { Module } from '@/models/Module'

export default function Dashboard() {
  const { data: screens, error, loading } = useFetchAuth<Screen[]>('/api/screens')

  const [screen, setScreen] = useState<Screen | null>(null)
  const [modulesModalOpen, setModulesModalOpen] = useState<boolean>(false)
  const [deleteScreenModalOpen, setDeleteScreenModalOpen] = useState<boolean>(false)

  useEffect(() => {
    if (screens) {
      setScreen(screens[0])
    }
  }, [screens])

  if (loading) {
    return <LoadingTopBar />
  }

  if (error) {
    throw error
  }

  if (!screens) {
    return null
  }

  if (!screen) {
    return null
  }

  const createScreen = async (name: string) => {
    const newId = screens!.reduce((biggest, screen) => (screen.id > biggest ? screen.id + 1 : biggest), 1)

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
      id: screens.length + 1,
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

  const addModulesToScreen = (modules: Module[]) => {
    setModulesModalOpen(false)

    let newId = screen?.slots.length || 1

    const newSlots: ScreenSlot[] = modules.map((module) => ({
      id: ++newId,
      moduleId: module.id,
      screenId: screen?.id,
      module,
      width: 1,
      height: 1,
      x: 2,
      y: 2,
    }))

    setScreen({
      ...screen,
      slots: [...screen.slots, ...newSlots],
    })
  }

  const deleteScreen = async (screenId: number) => {
    setDeleteScreenModalOpen(false)
    await fetcher(`/api/screens/${screen?.id}`, {
      method: 'DELETE',
    })
    setScreen(null)
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div>
        <ScreenToolbar
          currentScreen={screen}
          screens={screens}
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
