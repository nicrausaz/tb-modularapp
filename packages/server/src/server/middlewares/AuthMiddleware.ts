import { Request, Response, NextFunction } from 'express'
import { verifyAndDecodeToken } from '../libs/jwt'
import { User } from '../models/User'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
    })
  }

  verifyAndDecodeToken(token)
    .then((decoded) => {
      req.user = decoded as User
      next()
    })
    .catch(() => res.sendStatus(403))
}

export default authMiddleware
