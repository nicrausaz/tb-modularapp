export type ScreenSlot = {
  id: number
  moduleId: string
  screenId: number

  // TODO: add fields to handle the position of the module on the screen grid
}

export type Screen = {
  id: number
  name: string
  slots: ScreenSlot[]
}