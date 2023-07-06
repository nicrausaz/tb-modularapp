import { Configuration, Module, ModuleProps, SpecificConfiguration } from '../..'
import { test, expect } from '@jest/globals'

/**
 * Mock module for testing
 */
class TestModule extends Module {
  public status = 'blank'
  public data = {}

  init(): void {
    this.status = 'initialized'
  }
  destroy(): void {
    this.status = 'destroyed'
  }
  start(): void {
    this.status = 'started'
  }
  stop(): void {
    this.status = 'stopped'
  }
  onReceive(type: string, data: ModuleProps): void {
    this.data = data
  }
  onNewSubscriber(): void {
    throw new Error('Method not implemented.')
  }
}

/**
 * Mock configuration for testing
 */
const specificConfig = SpecificConfiguration.fromObject({
  test: {
    type: 'text',
    label: 'Test',
    description: 'The test description',
    value: 'new test',
  },
})

const config = new Configuration('test', 'test description', '0.0.0', 'test author', '', [], specificConfig)

test('Module class should exists', () => {
  expect(Module).toBeDefined()
})

//
// Configuration tests
//
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

test('Module should have a method to get the specific configuration', () => {
  const module = new TestModule(config)
  expect(module.currentConfig).toBe(specificConfig)
})

test('Should be able to set a key of the current configuration', () => {
  const module = new TestModule(config)

  module.setConfiguration([
    {
      name: 'test',
      value: 'new test',
    },
  ])
  expect(module.currentConfig.getEntry('test')?.value).toBe('new test')
})

//
// Module lifecycle tests
//
test('Module should have a method to init the module', () => {
  const module = new TestModule(config)
  expect(module.init).toBeDefined()

  module.init()
  expect(module.status).toBe('initialized')
})

test('Module should have a method to destroy the module', () => {
  const module = new TestModule(config)
  expect(module.destroy).toBeDefined()

  module.destroy()
  expect(module.status).toBe('destroyed')
})

test('Module should have a method to start the module', () => {
  const module = new TestModule(config)
  expect(module.start).toBeDefined()

  module.start()
  expect(module.status).toBe('started')
})

test('Module should have a method to stop the module', () => {
  const module = new TestModule(config)
  expect(module.stop).toBeDefined()

  module.stop()
  expect(module.status).toBe('stopped')
})

test('Module should have a method to receive data', () => {
  const module = new TestModule(config)
  expect(module.onReceive).toBeDefined()
  expect(module.data).toEqual({})
  module.onReceive('test', { test: 'test' })
  expect(module.data).toEqual({ test: 'test' })
})
