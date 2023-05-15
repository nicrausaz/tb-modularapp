import { ModuleDTO } from './ModuleDTO'

export type ScreenDTO = {
  readonly id: number
  readonly name: string
  slots: ScreenSlotDTO[]
}

export type ScreenSlotDTO = {
  readonly id: number
  module: ModuleDTO
}

export type UpdateScreenDTO = {
  readonly id: number
  readonly name: string
  readonly slots: UpdateScreenSlotDTO[]
}

export type UpdateScreenSlotDTO = {
  readonly id: number
  readonly moduleId: string
}
