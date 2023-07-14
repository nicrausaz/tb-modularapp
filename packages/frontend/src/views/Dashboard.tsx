import { useEffect, useState } from 'react'
import { useFetchAuth } from '@/hooks/useFetch'
import { Screen, ScreenSlot } from '@/models/Screen'
import ScreenToolbar from '@/components/screens/ScreenToolbar'
import LoadingTopBar from '@/components/LoadingTopBar'
import ScreenEditor from '@/components/screens/ScreenEditor'
import ChoseModulesModal from '@/components/module/ChoseModulesModal'
import ConfirmScreenDeleteModal from '@/components/screens/ConfirmScreenDeleteModal'
import { Module } from '@/models/Module'
import { useToast } from '@/contexts/ToastContext'
import { uuid } from '@/helpers'
import { createOrSave, remove } from '@/api/requests/screens'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { data, error, loading } = useFetchAuth<Screen[]>('/api/screens')

  const [screens, setScreens] = useState<Screen[]>([])
  const [screen, setScreen] = useState<Screen | null>(null)
  const [modulesModalOpen, setModulesModalOpen] = useState<boolean>(false)
  const [deleteScreenModalOpen, setDeleteScreenModalOpen] = useState<boolean>(false)

  const { t } = useTranslation()
  const { tSuccess, tError } = useToast()

  useEffect(() => {
    if (data) {
      setScreens(data)
      setScreen(data[0])
    }
  }, [data])

  useEffect(() => {
    if (screens.length > 0) {
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
    const newScreen = {
      id,
      name,
      enabled: true,
      slots: [],
    }

    await createOrSave(newScreen)

    setScreens([...screens, newScreen])
    setScreen(newScreen)
    tSuccess(t('status.success'), t('dashboard.feedbacks.screen_created_ok'))
  }

  const saveScreen = async (screen: Screen) => {
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

    await createOrSave(screen)

    setScreens(screens.map((s) => (s.id === screen.id ? screen : s)))
    tSuccess(t('status.success'), t('dashboard.feedbacks.screen_saved_ok'))
  }

  const handleLayoutChange = (slots: ScreenSlot[]) => {
    setScreen({
      ...screen,
      slots,
    })
  }

  const addModulesToScreen = (modules: Module[]) => {
    setModulesModalOpen(false)

    // TODO: improve the placement
    const newSlots: ScreenSlot[] = modules.map((module) => ({
      id: uuid(),
      moduleId: module.id,
      screenId: screen?.id,
      module,
      width: 2,
      height: 2,
      x: (screen.slots.length * 2) % 10,
      y: 0,
    }))

    setScreen({
      ...screen,
      slots: [...screen.slots, ...newSlots],
    })
  }

  const deleteScreen = async (screenId: number) => {
    setDeleteScreenModalOpen(false)
    remove(screenId)
      .then(() => {
        setScreens(screens.filter((screen) => screen.id !== screenId))
        tSuccess(t('status.success'), t('dashboard.feedbacks.screen_deleted_ok'))
      })
      .catch((error) => {
        tError('Error', error.message)
      })
  }

  return (
    <div className="mx-4 my-2">
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
          onToggleEnabled={() => setScreen({ ...screen, enabled: !screen.enabled })}
        />
        {screen.slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-xl text-gray-500">{t('dashboard.screen_empty')}</p>
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 220px)' }}>
            <ScreenEditor
              slots={screen.slots}
              onChange={handleLayoutChange}
              containerClassName="border rounded-lg w-full h-full"
            />
          </div>
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
