import { ScreenSlotEntity } from './ScreenSlot'

export type ScreenEntity = {
  id: number
  name: string
  enabled: boolean
  slots: ScreenSlotEntity[]
}
