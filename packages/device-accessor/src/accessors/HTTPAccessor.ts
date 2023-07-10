import BaseAccessor from './BaseAccessor'

/**
 * HTTPAccessor allows to receive data from the API.
 */
export default class HTTPAccessor extends BaseAccessor {
  constructor() {
    super('http')
  }

  public send(): void {
    // Nothing can be sent using HTTP accessor
  }

  public run(): void {}

  public stop(): void {}
}
