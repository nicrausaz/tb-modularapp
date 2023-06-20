import { Module } from './Module'

export type ScreenSlot = {
  id: string
  module: Module
  screenId: number
  width: number
  height: number
  x: number
  y: number
}

export type Screen = {
  id: number
  name: string
  enabled: boolean
  slots: ScreenSlot[]
}
