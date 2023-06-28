type ValidationReport = {
  type: string
  msg: string
  path: string
  value: string
  location: string
}

/**
 * Error thrown when a validation error occurs
 * Useful to retrieve the errors of each field
 */
export class ValidationError extends Error {
  private _errors: ValidationReport[]

  constructor(...errors: ValidationReport[]) {
    super('Validation error')
    this._errors = errors
  }

  /**
   * Get all the errors
   */
  get errors() {
    return this._errors
  }

  /**
   * Get the error message of a field
   * @param key key of the field
   * @returns the error message if it exists, an empty string otherwise
   */
  public f(key: string): string {
    return this._errors.find((error) => error.path === key)?.msg || ''
  }
}
