import { ErrorRequestHandler } from 'express'

const ErrorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log('ErrorMiddleware was called')
  console.log(err.stack)
  res.status(500).send({
    message: 'Internal server error',
  })
}

export { ErrorMiddleware }
