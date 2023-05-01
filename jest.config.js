/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  transformIgnorePatterns: ['/node_modules/', '/build/'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
}
