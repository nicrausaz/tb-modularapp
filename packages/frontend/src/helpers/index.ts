import { nanoid } from 'nanoid/non-secure'
import { fullscreen, closeFullscreen } from './fullscreen'

/**
 * Generates an unique indentifier
 *
 * For performance reasons, uses non-secure version of nanoid, should not be used for sensitive / security concerns.
 * @param length length of the unique identifier, default is 6
 * @returns unique identifier
 */
const uuid = (length = 6): string => {
  return nanoid(length)
}

export { fullscreen, closeFullscreen, uuid }
