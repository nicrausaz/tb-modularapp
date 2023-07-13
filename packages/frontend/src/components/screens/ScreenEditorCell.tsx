import { ScreenSlot } from '@/models/Screen'
import ModuleRender from '../module/ModuleRender'
import { CrossIcon } from '@/assets/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'

type ScreenEditorCellProps = {
  slot: ScreenSlot
  showRender?: boolean
  onDelete: (slot: ScreenSlot) => void
  readonly?: boolean
}

export default function ScreenEditorCell({ slot, onDelete, readonly = false }: ScreenEditorCellProps) {
  const [hover, setHover] = useState(false)
  if (!slot.module) {
    return null
  }

  const handleMouse = (enter: boolean) => {
    if (readonly) {
      return
    }
    setHover(enter)
  }

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => handleMouse(true)}
      onMouseLeave={() => handleMouse(false)}
    >
      {hover && (
        <Link
          className="absolute backdrop-blur-2xl bg-white/10 w-full py-1 px-3 italic font-bold text-neutral underline"
          to={`/modules/${slot.module.id}`}
          target="_blank"
        >
          {slot.module.nickname ? `${slot.module.nickname} (${slot.module.name})` : slot.module.name}
        </Link>
      )}
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
