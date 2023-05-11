export type ScreenDTO = {
  readonly id: number
  readonly name: string
  slots: ScreenSlotDTO[]
}

export type ScreenSlotDTO = {
  readonly id: number
  readonly name: string
}