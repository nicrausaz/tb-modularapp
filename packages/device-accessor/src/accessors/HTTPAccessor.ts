import BaseAccessor from './BaseAccessor'

/**
 * HTTPAccessor allows to send data over HTTP.
 * It uses the fetch API.
 */
export default class HTTPAccessor extends BaseAccessor {
  constructor() {
    super('http')
  }

  public async send<T>(url: string): Promise<T> {
    const response = await fetch(url)
    const data = await response.json()
    return data as T
  }

  public run(): void {}
  public stop(): void {}
}
