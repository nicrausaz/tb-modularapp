import { UploadedFile } from 'express-fileupload'
import { getDB } from '../../database/database'
import { Box } from '../models/entities/Box'
import { unlinkSync } from 'fs'

export default class BoxRepository {
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

  public update(box: Box) {}

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

  public uploadIcon(file: UploadedFile) {
    return new Promise<void>((resolve, reject) => {
      file.mv(`${process.env.PUBLIC_DIR}/${file.name}`, async (err) => {
        if (err) {
          reject(err)
        }
        console.log('File uploaded', `${process.env.PUBLIC_DIR}/${file.name}`)
        resolve()
      })
    })
  }
  
  /**
   * Delete the icon from the public directory
   * @param icon filename of the icon
   */
  public deleteIcon(icon: string) {
    unlinkSync(`${process.env.PUBLIC_DIR}/${icon}`)
  }
}
