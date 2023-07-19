import { ErrorRequestHandler } from 'express'
import { HTTPError } from './HTTPError'

/**
 * Default error handler middleware
 */
const ErrorMiddleware: ErrorRequestHandler = (err: HTTPError, req, res, _next) => {
  if (err instanceof SyntaxError) {
    res.status(400).send({ message: 'Request body malformed' })
  } else {
    res.status(err.status).send(err.toResponse())
  }
}

export { ErrorMiddleware }
