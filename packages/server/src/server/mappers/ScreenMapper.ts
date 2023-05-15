import { getDB } from '../../database/database'
import { ModuleDTO } from '../models/DTO/ModuleDTO'
import { ScreenDTO, ScreenSlotDTO, UpdateScreenDTO, UpdateScreenSlotDTO } from '../models/DTO/ScreenDTO'
import { ModuleEntity } from '../models/entities/Module'
import { ScreenEntity } from '../models/entities/Screen'
import { ScreenSlotEntity } from '../models/entities/ScreenSlot'
import ModuleMapper from './ModuleMapper'

export default class ScreenMapper {
  static async toDTO(screen: ScreenEntity): Promise<ScreenDTO> {
    return {
      id: screen.id,
      name: screen.name,
      slots: await Promise.all(screen.slots.map((slot) => ScreenMapper.slotToDTO(slot))),
    }
  }

  static toEntity(screen: ScreenDTO): ScreenEntity {
    return {
      id: screen.id,
      name: screen.name,
      slots: [],
    }
  }

  static screenUpdatetoEntity(screen: UpdateScreenDTO): ScreenEntity {
    return {
      id: screen.id,
      name: screen.name,
      slots: screen.slots.map((slot) => ScreenMapper.slotUpdateToEntity(screen.id, slot)),
    }
  }

  static async slotToDTO(slot: ScreenSlotEntity): Promise<ScreenSlotDTO> {
    return {
      id: slot.id,
      module: await this.getSlotModuleFromId(slot.moduleId),
    }
  }

  static slotUpdateToEntity(screenId: number, slot: UpdateScreenSlotDTO): ScreenSlotEntity {
    return {
      id: slot.id,
      moduleId: slot.moduleId,
      screenId: screenId,
    }
  }

  private static getSlotModuleFromId(moduleId: string): Promise<ModuleDTO> {
    const db = getDB()

    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM modules WHERE id = ?`, [moduleId], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(ModuleMapper.toSlotModule(row as ModuleEntity))
        }
      })
    })
  }
}
