import { ErrorRequestHandler } from 'express'
import { HTTPError } from './HTTPError'

const ErrorMiddleware: ErrorRequestHandler = (err: HTTPError, req, res, next) => {
  res.status(err.status).send(err.toResponse())
}

export { ErrorMiddleware }
