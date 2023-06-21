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
import { useToast } from '@/contexts/ToastContext'
import { uuid } from '@/helpers'

export default function Dashboard() {
  const { data: screens, error, loading } = useFetchAuth<Screen[]>('/api/screens')

  const [screen, setScreen] = useState<Screen | null>(null)
  const [modulesModalOpen, setModulesModalOpen] = useState<boolean>(false)
  const [deleteScreenModalOpen, setDeleteScreenModalOpen] = useState<boolean>(false)

  const { tSuccess } = useToast()

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

  const createScreen = async ({ id, name }: { id: number; name: string }) => {
    await fetcher(`/api/screens/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        name,
        enabled: true,
        slots: [],
      }),
    })

    setScreen({
      id: id,
      name,
      enabled: true,
      slots: [],
    })

    tSuccess('Success', 'Screen created')
  }

  const saveScreen = async (screen: Screen) => {
    console.log('saveScreen', screen)
    setScreen({
      ...screen,
    })

    // Transform screen slots
    screen.slots = screen.slots.map((slot) => ({
      id: slot.id,
      moduleId: slot.module?.id,
      width: slot.width,
      height: slot.height,
      x: slot.x,
      y: slot.y,
      screenId: screen.id,
      module: slot.module,
    }))

    await fetcher(`/api/screens/${screen.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(screen),
    })

    tSuccess('Success', 'Screen saved')
  }

  const handleLayoutChange = (slots: ScreenSlot[]) => {
    console.log('handleLayoutChange on parent', slots)
    setScreen({
      ...screen,
      slots,
    })
  }

  const addModulesToScreen = (modules: Module[]) => {
    setModulesModalOpen(false)

    const newSlots: ScreenSlot[] = modules.map((module) => ({
      id: uuid(),
      moduleId: module.id,
      screenId: screen?.id,
      module,
      width: 3,
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
    await fetcher(`/api/screens/${screenId}`, {
      method: 'DELETE',
    })
    setScreen(screens[0])
  }

  return (
    <div>
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
        {screen.slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-gray-500">No module added to this screen yet</p>
          </div>
        ) : (
          <ScreenEditor slots={screen.slots} onChange={handleLayoutChange} />
        )}
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
