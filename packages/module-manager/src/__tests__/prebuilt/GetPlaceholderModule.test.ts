// import { GetPlaceholderModule } from '../../index'

// // Functionality tests
// test('Placeholder module should exists', () => {
//   expect(GetPlaceholderModule).toBeDefined()
// })

// test('Placeholder module should render', () => {
//   const m = new GetPlaceholderModule().config({ url: 'https://jsonplaceholder.typicode.com/todos/1' }).init()
//   expect(m.render()).toBe('Placeholder module render')
// })


// // Errors tests
// test('Placeholder module should throw if no configuration', () => {
//   const m = new GetPlaceholderModule()
//   expect(() => m.init()).toThrow()
// })

// test('Placeholder module should throw if invalid configuration (missing required)', () => {
//   const m = new GetPlaceholderModule().config({ url: '' })
//   expect(() => m.init()).toThrow()
// })

// // test('Placeholder module should throw if no call to init', () => {
// //   const m = new GetPlaceholderModule().config({ url: 'https://jsonplaceholder.typicode.com/todos/1' })
// //   expect(() => m.render()).toThrow()
// // })