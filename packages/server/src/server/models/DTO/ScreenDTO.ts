import { InSlotModuleDTO } from './ModuleDTO'

export type ScreenDTO = {
  readonly id: number
  readonly name: string
  readonly enabled: boolean
  slots: ScreenSlotDTO[]
}

export type ScreenSlotDTO = {
  readonly id: string
  module: InSlotModuleDTO
  readonly width: number
  readonly height: number
  readonly x: number
  readonly y: number
}

export type UpdateScreenDTO = {
  readonly id: number
  readonly name: string
  readonly enabled: boolean
  readonly slots: UpdateScreenSlotDTO[]
}

export type UpdateScreenSlotDTO = {
  readonly id: string
  readonly moduleId: string
  readonly width: number
  readonly height: number
  readonly x: number
  readonly y: number
}
