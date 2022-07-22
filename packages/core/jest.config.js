/** @typedef {import('ts-jest')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    '^.+\\.(t|j)s$': ['@swc-node/jest'],
  },
  moduleFileExtensions: ['js', 'ts', 'd.ts'],
  testPathIgnorePatterns: ['dist'],
  collectCoverageFrom: ['src/**/*.ts'],
  setupFiles: ['jest-date-mock'],
}
