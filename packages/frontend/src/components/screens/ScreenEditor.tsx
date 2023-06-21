import { useEffect, useState } from 'react'
import GridLayout, { Layout } from 'react-grid-layout'
import ScreenEditorCell from './ScreenEditorCell'
import { Module } from '@/models/Module'
import { ScreenSlot } from '@/models/Screen'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

type ScreenEditorProps = {
  slots: ScreenSlot[]
  onChange?: (slots: ScreenSlot[]) => void
  readonly?: boolean
}

type AugmentedLayout = GridLayout.Layout & {
  module: Module
  screenId: number
}

const screenSlotToLayout = (slot: ScreenSlot): AugmentedLayout => {
  return {
    i: slot.id,
    x: slot.x,
    y: slot.y,
    w: slot.width,
    h: slot.height,
    module: slot.module,
    screenId: slot.screenId,
  }
}

const layoutToScreenSlot = (layout: AugmentedLayout): ScreenSlot => {
  return {
    id: layout.i,
    x: layout.x,
    y: layout.y,
    width: layout.w,
    height: layout.h,
    module: layout.module,
    screenId: layout.screenId,
  }
}

export default function ScreenEditor({ slots, onChange, readonly = false }: ScreenEditorProps) {
  const [layout, setLayout] = useState<AugmentedLayout[]>([])

  useEffect(() => {
    setLayout(slots.map(screenSlotToLayout))
  }, [slots])

  const removeSlot = (slot: ScreenSlot) => {
    const newLayout = layout.filter((l) => l.i !== slot.id.toString())
    setLayout(newLayout)

    if (onChange) {
      onChange(newLayout.map(layoutToScreenSlot))
    }
  }

  const onLayoutChange = (
    updated: AugmentedLayout[],
    _oldItem: Layout,
    _newItem: Layout,
    _placeholder: Layout,
    _event: MouseEvent,
    _element: HTMLElement,
  ) => {
    // Merge the new layout with the old one
    const newLayout: AugmentedLayout[] = layout.map((l) => {
      const newSlot = updated.find((s) => s.i === l.i)
      return {
        ...newSlot,
        module: l.module,
        screenId: l.screenId,
      }
    })

    setLayout(newLayout)

    if (onChange) {
      onChange(newLayout.map(layoutToScreenSlot))
    }
  }

  const editorProps: GridLayout.ReactGridLayoutProps = {
    isDraggable: !readonly,
    isResizable: !readonly,
    cols: 12,
    rowHeight: 150,
    width: 1200,
    resizeHandles: ['se'],
    compactType: null,
  }

  if (!layout.length) {
    return null
  }

  return (
    <GridLayout {...editorProps} layout={layout} onDragStop={onLayoutChange} className="border relative">
      {slots.map((slot) => (
        <div key={slot.id}>
          <ScreenEditorCell slot={slot} onDelete={removeSlot} readonly={readonly} />
        </div>
      ))}
    </GridLayout>
  )
}
