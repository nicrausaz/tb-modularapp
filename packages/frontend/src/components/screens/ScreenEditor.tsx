import { ScreenSlot } from '@/models/Screen'
import { useState } from 'react'
import GridLayout from 'react-grid-layout'
import ScreenEditorCell from './ScreenEditorCell'
import { Module } from '@/models/Module'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

type ScreenEditorProps = {
  slots: ScreenSlot[]
  onChange: (slots: ScreenSlot[]) => void
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
    isResizable: true,
    isDraggable: true,
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

export default function ScreenEditor({ slots, onChange }: ScreenEditorProps) {
  const [layout, setLayout] = useState<AugmentedLayout[]>(slots.map(screenSlotToLayout))

  const onLayoutChange = (newLayout: AugmentedLayout[]) => {
    setLayout(newLayout)
    onChange(newLayout.map(layoutToScreenSlot))
  }

  const onResize = (data) => {
    console.log('RESIZE', data)
  }

  const removeSlot = (slot: ScreenSlot) => {
    const newLayout = layout.filter((l) => l.i !== slot.id.toString())
    setLayout(newLayout)
    onChange(newLayout.map(layoutToScreenSlot))
  }

  const editorProps: GridLayout.ReactGridLayoutProps = {
    isDraggable: true,
    isResizable: true,
    cols: 6,
    rowHeight: 80,
    width: 1200,
    resizeHandles: ['se'],
  }

  return (
    <GridLayout {...editorProps} layout={layout} onLayoutChange={onLayoutChange} className="border relative">
      {slots.map((slot) => (
        <div key={slot.id} onResize={onResize}>
          <ScreenEditorCell slot={slot} onDelete={removeSlot} />
        </div>
      ))}
    </GridLayout>
  )
}
