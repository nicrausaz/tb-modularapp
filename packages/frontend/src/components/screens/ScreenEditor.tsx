import { useEffect, useState } from 'react'
import GridLayout from 'react-grid-layout'
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

// TODO: use memo to avoid unnecessary re-renders (https://github.com/react-grid-layout/react-grid-layout#react-hooks-performance)

type AugmentedLayout = GridLayout.Layout & {
  module: Module
  screenId: number
}

const screenSlotToLayout = (slot: ScreenSlot): AugmentedLayout => {
  return {
    i: slot.id.toString(),
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
    id: parseInt(layout.i),
    x: layout.x,
    y: layout.y,
    width: layout.w,
    height: layout.h,
    module: layout.module,
    screenId: layout.screenId,
  }
}

export default function ScreenEditor({ slots, onChange, readonly = false }: ScreenEditorProps) {
  const [layout, setLayout] = useState<AugmentedLayout[]>(slots.map(screenSlotToLayout))

  useEffect(() => {
    setLayout(slots.map(screenSlotToLayout))
  }, [slots])

  const onLayoutChange = (newLayout: AugmentedLayout[]) => {
    const mergedLayout = layout.map((l) => {
      const newSlot = newLayout.find((s) => s.i === l.i)
      if (newSlot) {
        return {
          ...newSlot,
          module: l.module,
          screenId: l.screenId,
        }
      }
    })

    setLayout(mergedLayout ?? [])

    if (onChange) {
      onChange(mergedLayout.map(layoutToScreenSlot))
    }
  }

  const removeSlot = (slot: ScreenSlot) => {
    const newLayout = layout.filter((l) => l.i !== slot.id.toString())
    setLayout(newLayout)

    if (onChange) {
      onChange(newLayout.map(layoutToScreenSlot))
    }
  }

  const editorProps: GridLayout.ReactGridLayoutProps = {
    isDraggable: !readonly,
    isResizable: !readonly,
    cols: 4,
    rowHeight: 120,
    width: 1200,
    resizeHandles: readonly ? [] : ['se'],
  }

  return (
    <GridLayout {...editorProps} layout={layout} onLayoutChange={onLayoutChange} className="border relative">
      {slots.map((slot) => (
        <div key={slot.id}>
          <ScreenEditorCell slot={slot} onDelete={removeSlot} readonly={readonly} />
        </div>
      ))}
    </GridLayout>
  )
}
