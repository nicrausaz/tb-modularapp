import { Request, Response, NextFunction } from 'express'
import { verifyAndDecodeToken } from '../libs/jwt'
import { User } from '../models/entities/User'
import logger from '../libs/logger'
import { UnauthorizedError } from './HTTPError'

const JwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    logger.warn('Unauthorized request')
    throw new UnauthorizedError('Unauthorized')
  }

  verifyAndDecodeToken(token)
    .then((decoded) => {
      req.user = decoded as User
      next()
    })
    .catch(() => {
      logger.warn('Error while verifying token')
      next(new UnauthorizedError('Token invalid or expired'))
    })
}

// const ApiKeyAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   // TODO: Implement API Key authentication
// }

export { JwtAuthMiddleware }
