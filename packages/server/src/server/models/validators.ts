import { body } from 'express-validator'

/**
 * Validation rule for login
 * @see LoginUserDTO
 */
export const loginRules = [
  body('username').trim().escape().notEmpty().withMessage('Username is required'),
  body('password').trim().escape().notEmpty().withMessage('Password is required'),
]

/**
 * Validation rule for user creation
 * @see CreateUserDTO
 */
export const userCreateRules = [
  body('username')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Username should be at least 3 characters'),

  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must contain at least 8 characters')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
    ),
]

/**
 * Validation rule for user update
 * @see UpdateUserDTO
 */
export const userUpdateRules = [
  body('username')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Username is required')
    .bail()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Username should be at least 3 characters'),

  body('password')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must contain at least 8 characters')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
    ),
]

/**
 * Validation rule for module update
 * @see UpdateModuleDTO
 */
export const moduleUpdateRules = []

/**
 * Validation rule for module configuration update
 * @see ModuleConfigurationUpdateDTO
 */
export const moduleConfigurationUpdateRules = [
  body('fields').isArray().withMessage('Fields must be an array'),
  body('fields.*.name').trim().escape().notEmpty().withMessage('Name is required'),
  body('fields.*.value').trim().escape().notEmpty().withMessage('Value is required'),
]

/**
 * Validation rule for module status update
 */
export const moduleStatusUpdateRules = [body('enabled').notEmpty().isBoolean().withMessage('Enabled must be a boolean')]

/**
 * Validation rule for screen creation & update
 * @see UpdateScreenDTO
 */
export const screenUpdateRules = [
  body('id').trim().escape().notEmpty().withMessage('Id is required'),
  body('name').trim().escape().notEmpty().withMessage('Name is required'),
  body('enabled').notEmpty().isBoolean().withMessage('Enabled must be a boolean'),
  body('slots').isArray().withMessage('Slots must be an array'),
  body('slots.*.id').trim().escape().notEmpty().withMessage('Slot id is required'),
  body('slots.*.moduleId').trim().escape().notEmpty().withMessage('Module id is required'),
  body('slots.*.width').notEmpty().isInt().withMessage('Width must be an integer'),
  body('slots.*.height').notEmpty().isInt().withMessage('Height must be an integer'),
  body('slots.*.x').notEmpty().isInt().withMessage('x must be an integer'),
  body('slots.*.y').notEmpty().isInt().withMessage('y must be an integer'),
]
