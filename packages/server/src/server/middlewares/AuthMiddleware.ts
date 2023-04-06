import { Request, Response, NextFunction } from 'express'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("The auth middleware is called")
  next()
}

export default authMiddleware
