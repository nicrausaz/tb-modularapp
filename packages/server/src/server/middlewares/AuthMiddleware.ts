import { Request, Response, NextFunction } from 'express'
import { verifyAndDecodeToken } from '../libs/jwt'
import { User } from '../models/entities/User'
import logger from '../libs/logger'

const JwtAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    logger.warn('Unauthorized request')
    return res.status(401).json({
      message: 'Unauthorized',
    })
  }

  verifyAndDecodeToken(token)
    .then((decoded) => {
      req.user = decoded as User
      next()
    })
    .catch(() => {
      logger.warn('Error while verifying token')
      res.sendStatus(403)
    })
}

const ApiKeyAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement API Key authentication
}

export { JwtAuthMiddleware, ApiKeyAuthMiddleware }
