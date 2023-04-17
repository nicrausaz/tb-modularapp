import { Configuration, Module, SpecificConfiguration } from '@yalk/module/src'

class TestModule extends Module {
  init(): this {
    return this
  }
  destroy(): void {
    throw new Error('Method not implemented.')
  }
  start(): void {
    throw new Error('Method not implemented.')
  }
  stop(): void {
    throw new Error('Method not implemented.')
  }
}

const specificConfig = SpecificConfiguration.fromObject({
  test: {
    type: 'string',
    label: 'Test',
    description: 'The test description',
    value: 'new test',
  },
})

const config = new Configuration('test', 'test description', '0.0.0', 'test author', specificConfig)

test('Module class should exists', () => {
  expect(Module).toBeDefined()
})

test('Module should be instantiable with a configuration', () => {
  const module = new TestModule(config)
  expect(module).toBeDefined()
})

test('Module should have getters to the configuration', () => {
  const module = new TestModule(config)
  expect(module.name).toBe('test')
  expect(module.description).toBe('test description')
  expect(module.version).toBe('0.0.0')
  expect(module.author).toBe('test author')
})
