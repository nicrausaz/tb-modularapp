import { getDB } from '../../database/database'
import { ScreenEntity } from '../models/entities/Screen'
import { ScreenSlotEntity } from '../models/entities/ScreenSlot'

export default class ScreenRepository {
  getAll(): Promise<ScreenEntity[]> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT s.id AS screenId, s.name, s.enabled, sl.id, sl.moduleId, sl.width, sl.height, sl.x, sl.y FROM Screens AS s LEFT JOIN ScreenSlots as sl ON s.id = sl.screenId',
        (err, rows) => {
          if (err) {
            reject(err)
          }

          const screens = {} as { [key: number]: ScreenEntity }

          rows.forEach((row: any) => {
            const screenId = row.screenId
            const slot = {
              id: row.id,
              moduleId: row.moduleId,
              screenId: screenId,
              width: row.width,
              height: row.height,
              x: row.x,
              y: row.y,
            }

            if (!screens[screenId]) {
              screens[screenId] = {
                id: screenId,
                name: row.name,
                enabled: row.enabled,
                slots: [],
              }
            }

            if (slot.id) {
              screens[screenId].slots.push(slot)
            }
          })

          resolve(Object.values(screens))
        },
      )
      db.close()
    })
  }

  async getById(id: number): Promise<ScreenEntity> {
    // TODO: use a single query instead of two (join)
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

    // Remove slots that are not in the new screen
    const oldSlots = await this.getScreenSlots(screen.id)
    const slotsToDelete = oldSlots.filter((oldSlot) => !screen.slots.find((newSlot) => newSlot.id === oldSlot.id))
    await Promise.all(slotsToDelete.map((slot) => this.deleteScreenSlot(slot.id)))

    // Update or create slots that are in the new screen
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

  /**
   * Delete the specified screen
   * @param id id of the screen to delete
   */
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

  /**
   * Delete all screen slots for the specified screen
   * @param id id of the screen to delete the slots for
   */
  private async deleteScreenSlots(id: number): Promise<void> {
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

  /**
   * Delete the specified screen slot
   * @param id id of the screen slot to delete
   */
  private async deleteScreenSlot(id: string): Promise<void> {
    const db = getDB()
    return new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM ScreenSlots WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Get the screen with the specified id
   * @param id id of the screen to get
   * @returns the screen with the specified id
   */
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

  /**
   * Get the slots of the specified screen
   * @param screenId id of the screen to get the slots for
   * @returns the slots of the specified screen
   */
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

  /**
   * Insert the specified screen or update it if it already exists
   * @param screenId id of the screen to insert or update
   * @param slot slot to insert or update
   * @returns
   */
  private insertOrUpdateScreenSlot(screenId: number, slot: ScreenSlotEntity) {
    return new Promise((resolve) => {
      this.screenSlotExists(screenId, slot.id).then((exists) => {
        if (exists) {
          resolve(this.updateScreenSlot(screenId, slot))
        } else {
          resolve(this.createScreenSlot(screenId, slot))
        }
      })
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

  /**
   * Create the specified screen slot
   * @param screenId the id of the screen to create the slot for
   * @param slot the slot to create
   * @returns
   */
  private createScreenSlot(screenId: number, slot: ScreenSlotEntity) {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO ScreenSlots (id, moduleId, screenId, width, height, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [slot.id, slot.moduleId, screenId, slot.width, slot.height, slot.x, slot.y],
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

  /**
   * Update the specified screen
   * @param screen the screen to update
   * @returns
   */
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

  /**
   * Update the specified screen slot
   * @param screenId the id of the screen to update the slot for
   * @param slot the slot to update
   * @returns
   */
  private updateScreenSlot(screenId: number, slot: ScreenSlotEntity) {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE ScreenSlots SET moduleId = ?, width = ?, height = ?, x = ?, y = ? WHERE id = ? AND screenId = ?',
        [slot.moduleId, slot.width, slot.height, slot.x, slot.y, slot.id, screenId],
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

  /**
   * Check if the specified screen slot exists
   * @param screenId the id of the screen to check the slot for
   * @param slotId the id of the slot to check
   * @returns true if the slot exists, false otherwise
   */
  private screenSlotExists(screenId: number, slotId: string): Promise<boolean> {
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
