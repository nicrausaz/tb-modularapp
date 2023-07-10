import { UploadedFile } from 'express-fileupload'
import { getDB } from '../../database/database'
import { Box } from '../models/entities/Box'
import { unlinkSync } from 'fs'
import { CreateAPIKeyDTO, UpdateBoxDTO } from '../models/DTO/BoxDTO'
import { join } from 'path'
import { APIKey } from '../models/entities/APIKey'

/**
 * Handle the database operations for the box
 */
export default class BoxRepository {
  /**
   * Get the box
   */
  public get(): Promise<Box> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Box', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows[0] as Box)
      })
      db.close()
    })
  }

  /**
   * Update the box information
   * @param box new box information
   */
  public update(box: UpdateBoxDTO) {
    const db = getDB()
    db.run('UPDATE Box SET name = ?', [box.name])
    db.close()
  }

  /**
   * Update the icon of the box
   * @param icon filename of the icon
   */
  public updateIcon(icon: string): void {
    const db = getDB()
    db.run('UPDATE Box SET icon = ?', [icon])
    db.close()
  }

  /**
   * Remove the icon of the box
   */
  public removeIcon(): void {
    const db = getDB()
    db.run('UPDATE Box SET icon = NULL')
    db.close()
  }

  /**
   * Upload a new icon for the box to the public directory
   * @param file filename of the icon
   */
  public uploadIcon(file: UploadedFile): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = join(process.env.PUBLIC_DIR ?? '', file.name)
      file.mv(path, async (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  /**
   * Delete the icon from the public directory
   * @param icon filename of the icon
   */
  public deleteIcon(icon: string) {
    unlinkSync(join(process.env.PUBLIC_DIR ?? '', icon))
  }

  /**
   * Get all the API keys
   */
  public getAPIKeys(): Promise<APIKey[]> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM APIKeys', (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows as APIKey[])
      })
      db.close()
    })
  }

  /**
   * Create a new API key
   */
  public createAPIKey(key: CreateAPIKeyDTO): Promise<void> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO APIKeys (name, key, display) VALUES (?, ?, ?)', [key.name, key.key, key.display], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Delete an API key
   * @param id id of the API key
   */
  public deleteAPIKey(id: number): Promise<void> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM APIKeys WHERE id = ?', [id], (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
      db.close()
    })
  }

  /**
   * Check if an API key exists
   * @param id id of the API key
   * @returns
   */
  public async APIKeyExists(id: number): Promise<boolean> {
    const db = getDB()
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM APIKeys WHERE id = ?', [id], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows.length > 0)
      })
      db.close()
    })
  }
}
