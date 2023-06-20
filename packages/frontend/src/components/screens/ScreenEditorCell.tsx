import { ScreenSlot } from '@/models/Screen'
import ModuleRender from '../module/ModuleRender'
import { CrossIcon } from '@/assets/icons'

type ScreenEditorCellProps = {
  slot: ScreenSlot
  showRender?: boolean
  onDelete: (slot: ScreenSlot) => void
  readonly?: boolean
}

export default function ScreenEditorCell({ slot, onDelete, readonly = false }: ScreenEditorCellProps) {
  return (
    <div className="bg-base-300 w-full h-full relative rounded">
      <ModuleRender id={slot.module.id} />

      {!readonly && (
        <div
          className="absolute bg-base-100 border rounded-full top-0 right-0 translate-x-2 -translate-y-2 cursor-pointer"
          onClick={() => onDelete(slot)}
        >
          <CrossIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  )
}
