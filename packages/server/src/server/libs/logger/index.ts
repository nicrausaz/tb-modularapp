import { createLogger, format, transports } from 'winston'
const { combine, colorize, timestamp, json, splat } = format

const logger = createLogger({
  level: 'info',
  format: combine(json(), timestamp(), splat()),
  defaultMeta: { service: 'modapp-server' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `app.log`
    new transports.File({ filename: 'logs/app.log' }),
  ],
})

// Development logger
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp}: [${level}] - ${message}`
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(logFormat, splat(), colorize()),
    }),
  )
}

export default logger
