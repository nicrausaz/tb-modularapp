import { Request, Response, NextFunction } from 'express'
import { verifyAndDecodeToken } from '../libs/jwt'
import { ReqUser } from '../models/entities/User'
import logger from '../libs/logger'
import { UnauthorizedError } from './HTTPError'
import { verifyString } from '../libs/security'
import { getDB } from '../../database/database'

const JwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    logger.warn('Unauthorized request')
    throw new UnauthorizedError('Unauthorized')
  }

  verifyAndDecodeToken(token)
    .then((decoded) => {
      req.user = decoded as ReqUser
      next()
    })
    .catch(() => {
      logger.warn('Error while verifying token')
      next(new UnauthorizedError('Token invalid or expired'))
    })
}

const APIKeyAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const key = req.header('x-api-key')

  if (!key) {
    logger.warn('Unauthorized request')
    throw new UnauthorizedError('Unauthorized')
  }

  validateKey(key)
    .then((isValid) => {
      if (isValid) {
        next()
      } else {
        logger.warn('Invalid API key')
        next(new UnauthorizedError('Key invalid or expired'))
      }
    })
    .catch((error) => {
      logger.warn('Error while verifying key', error)
      next(new UnauthorizedError('Key invalid or expired'))
    })
}

const validateKey = async (key: string): Promise<boolean> => {
  const db = getDB()
  return new Promise((resolve, reject) => {
    db.all('SELECT key FROM APIKeys', (err, rows) => {
      if (err) {
        logger.warn('Error w while verifying key, no rows found')
        reject(false)
        return
      }

      const rws = rows as Array<{ key: string }>
      const promises = rws.map((r) => verifyString(r.key, key))

      Promise.all(promises)
        .then((results) => {
          const isValid = results.some((res) => res === true)
          resolve(isValid)
        })
        .catch((error) => {
          logger.warn('Error while verifying key:', error)
          resolve(false)
        })
        .finally(() => {
          db.close()
        })
    })
  })
}

export { JwtAuthMiddleware, APIKeyAuthMiddleware }
