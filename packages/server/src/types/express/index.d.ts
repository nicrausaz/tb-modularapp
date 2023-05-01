/**
 * Augment the Express.Request interface with our own custom properties.
 */
declare namespace Express {
  interface Request {
    user: import('../../server/models/User').User
  }
}
