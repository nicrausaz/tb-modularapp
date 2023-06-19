import { ScreenSlot } from '@/models/Screen'
import ModuleRender from '../module/ModuleRender'
import { MoreDotsVertIcon } from '@/assets/icons'
import ContextDropdown from '../ContextDropdown'

type ScreenEditorCellProps = {
  slot: ScreenSlot
  showRender?: boolean
}

export default function ScreenEditorCell({ slot }: ScreenEditorCellProps) {
  const actions = [
    {
      label: 'Edit',
      onClick: () => {},
    },
    {
      label: 'Delete',
      onClick: () => {},
    },
  ]

  return (
    <div className="bg-base-300 w-full h-full relative rounded">
      <ModuleRender id={slot.module.id} />

      <div className="absolute rounded-full top-0 right-0 translate-x-2 -translate-y-2 cursor-pointer">
        <ContextDropdown icon={<MoreDotsVertIcon className="w-5 h-5" />} actions={actions} />
      </div>
    </div>
  )
}
