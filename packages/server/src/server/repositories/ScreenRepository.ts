import { getDB } from '../../database/database'
import { ScreenEntity } from '../models/entities/Screen'
import { ScreenSlotEntity } from '../models/entities/ScreenSlot'

export default class ScreenRepository {
  getAll(): Promise<ScreenEntity[]> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Screens', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows as ScreenEntity[])
      })
      db.close()
    })
  }

  async getById(id: number): Promise<ScreenEntity> {
    return {
      ...(await this.getScreen(id)),
      slots: await this.getScreenSlots(id),
    }
  }

  async create(screen: ScreenEntity) {
    await this.createScreen(screen)
    await Promise.all(screen.slots.map((slot) => this.insertOrUpdateScreenSlot(screen.id, slot)))
  }

  async update(screen: ScreenEntity) {
    await this.updateScreen(screen)
    await Promise.all(screen.slots.map((slot) => this.insertOrUpdateScreenSlot(screen.id, slot)))
  }

  async exists(id: number): Promise<boolean> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Screens WHERE id = ?', [id], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows.length > 0)
      })
      db.close()
    })
  }

  async delete(id: number): Promise<void> {
    await this.deleteScreen(id)
    await this.deleteScreenSlots(id)
  }

  async deleteScreen(id: number): Promise<void> {
    const db = getDB()
    return new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM Screens WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  async deleteScreenSlots(id: number): Promise<void> {
    const db = getDB()
    return new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM ScreenSlots WHERE screenId = ?', [id], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  private getScreen(id: number): Promise<ScreenEntity> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Screens WHERE id = ?', [id], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows[0] as ScreenEntity)
      })
      db.close()
    })
  }

  private getScreenSlots(screenId: number): Promise<ScreenSlotEntity[]> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM ScreenSlots WHERE screenId = ?', [screenId], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows as ScreenSlotEntity[])
      })
      db.close()
    })
  }

  private insertOrUpdateScreenSlot(screenId: number, slot: ScreenSlotEntity) {
    return new Promise((resolve) => {
      this.screenSlotExists(screenId, slot.id).then((exists) => {
        if (exists) {
          resolve(this.updateScreenSlot(screenId, slot))
        } else {
          resolve(this.insertScreenSlot(screenId, slot))
        }
      })
    })
  }

  private insertScreenSlot(screenId: number, slot: ScreenSlotEntity) {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO ScreenSlots (id, moduleId, screenId) VALUES (?, ?, ?)',
        [slot.id, slot.moduleId, screenId],
        (err) => {
          if (err) {
            reject(err)
          }
          resolve(slot)
        },
      )
      db.close()
    })
  }

  private createScreen(screen: ScreenEntity) {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO Screens (id, name) VALUES (?, ?)', [screen.id, screen.name], (err) => {
        if (err) {
          reject(err)
        }
        resolve(screen)
      })
      db.close()
    })
  }

  private updateScreen(screen: ScreenEntity) {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run('UPDATE Screens SET name = ? WHERE id = ?', [screen.name, screen.id], (err) => {
        if (err) {
          reject(err)
        }
        resolve(screen)
      })
      db.close()
    })
  }

  private updateScreenSlot(screenId: number, slot: ScreenSlotEntity) {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE ScreenSlots SET moduleId = ? WHERE id = ? AND screenId = ?',
        [slot.moduleId, slot.id, screenId],
        (err) => {
          if (err) {
            console.log(err)
            reject(err)
          }
          resolve(slot)
        },
      )
      db.close()
    })
  }

  private screenSlotExists(screenId: number, slotId: number): Promise<boolean> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM ScreenSlots WHERE screenId = ? AND id = ?', [screenId, slotId], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows.length > 0)
      })
      db.close()
    })
  }
}
