import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'

/**
 * Perform provided validation rules on the request
 * @param validationRules array of validation rules to perform
 */
const Validator = (validationRules: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validationRules.map((rule) => rule.run(req)))

    const result = validationResult(req)
    if (result.isEmpty()) {
      return next()
    }

    res.status(400).json({ errors: result.array() })
  }
}

export default Validator
