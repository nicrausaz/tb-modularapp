import { AddSquareIcon, ArrowDownIcon, NewScreenIcon, OpenNewTabIcon, SaveIcon, TrashIcon } from '@/assets/icons'
import { Screen } from '@/models/Screen'
import { useEffect, useState } from 'react'
import IconButton from '@/components/IconButton'
import Input from '@/components/Input'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/contexts/ToastContext'

type ScreenToolbarProps = {
  currentScreen: Screen
  screens: Screen[]
  onScreenSelection: (screen: Screen) => void
  onScreenAdd: ({ id, name }: { id: number; name: string }) => void
  onSave: (screen: Screen) => void
  onSlotAdd: () => void
  onNameChange: (name: string) => void
  onDelete: (screen: Screen) => void
  onToggleEnabled: (enabled: boolean) => void
}

export default function ScreenToolbar({
  currentScreen,
  screens,
  onScreenSelection,
  onScreenAdd,
  onSave,
  onSlotAdd,
  onNameChange,
  onDelete,
  onToggleEnabled,
}: ScreenToolbarProps) {
  const [screenName, setScreenName] = useState('')
  const [screenNameError, setScreenNameError] = useState<string>('')

  const { t } = useTranslation()
  const { tError } = useToast()

  useEffect(() => {
    if (currentScreen) {
      setScreenName(currentScreen.name)
    }
  }, [currentScreen])

  const otherScreens = screens.filter((screen) => screen.name !== currentScreen.name)

  const handleAddScreen = () => {
    const id = screens.reduce((biggest, screen) => (screen.id >= biggest ? screen.id + 1 : biggest), 1)
    onScreenAdd({
      id,
      name: `Screen ${id}`,
    })
  }

  const handleSaveScreen = () => {
    if (currentScreen.name.trim() === '') {
      tError(t('status.error'), t('dashboard.feedbacks.screen_name_error'))
      setScreenNameError(t('dashboard.feedbacks.screen_name_error'))
      return
    }

    setScreenNameError('')
    onSave(currentScreen)
  }

  const handleDeleteScreen = () => {
    onDelete(currentScreen)
  }

  const toggleEnabled = () => {
    onToggleEnabled(!currentScreen.enabled)
  }

  return (
    <div className="flex justify-between items-center border w-full rounded-lg shadow bg-base-200 p-2 mb-4">
      <div>
        <Input
          type="text"
          name={'screenName'}
          value={screenName}
          onChange={(value) => onNameChange(value)}
          placeholder={t('dashboard.screen_name_placeholder')}
          className="input-md"
          error={screenNameError}
          displayErrorLabel={false}
        />
      </div>
      <div className="flex items-center">
        <div className="tooltip tooltip-bottom flex" data-tip={t('dashboard.screen_active')}>
          <input
            type="checkbox"
            className="toggle toggle-success"
            onChange={toggleEnabled}
            defaultChecked={currentScreen.enabled}
          />
        </div>
        <div className="dropdown dropdown-hover dropdown-end">
          <label tabIndex={0} className="btn m-1 truncate">
            {screenName}
            <ArrowDownIcon className="w-4 h-4" />
          </label>
          <ul tabIndex={0} className="mr-2 w-40 dropdown-content menu p-2 shadow bg-base-100 rounded-box z-50">
            {otherScreens.map((screen) => (
              <li key={screen.id}>
                <a onClick={() => onScreenSelection(screen)} className="overflow-hidden">
                  {screen.name}
                </a>
              </li>
            ))}
            <li className="border-t mt-2 pt-2">
              <a onClick={handleAddScreen}>
                <NewScreenIcon className="w-4 h-4" />
                {t('dashboard.screen_create')}
              </a>
            </li>
          </ul>
        </div>
        <div className="flex gap-2">
          <IconButton
            onClick={onSlotAdd}
            icon={<AddSquareIcon className="w-4 h-4" />}
            position="right"
            label={t('dashboard.screen_add_module')}
            className="btn-outline"
          />

          <IconButton
            onClick={handleDeleteScreen}
            icon={<TrashIcon className="w-4 h-4" />}
            position="right"
            label={t('dashboard.screen_delete')}
            className="btn-error"
          />

          <IconButton
            onClick={handleSaveScreen}
            icon={<SaveIcon className="w-4 h-4" />}
            position="right"
            label={t('dashboard.screen_save')}
            className="btn-success"
          />

          <IconButton
            icon={<OpenNewTabIcon className="w-4 h-4" />}
            position="right"
            label={t('dashboard.screen_preview')}
            className="btn-info"
            to={`/visualize/${currentScreen?.id}`}
            target="_blank"
            asLink={true}
          />
        </div>
      </div>
    </div>
  )
}
