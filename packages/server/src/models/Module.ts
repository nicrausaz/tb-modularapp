export default class Module {
  id!: string
  name!: string
  description!: string
  version!: string

  static fromJSON(json: string): Module {
    // TODO
    const module = new Module()
    Object.assign(module, JSON.parse(json))
    return module
  }
}
