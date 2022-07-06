/** @typedef {import('ts-jest')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    '^.+\\.(t|j)s$': ['@swc-node/jest'],
  },
  testPathIgnorePatterns: ['dist'],
  collectCoverageFrom: ['src/**/*.ts'],
  setupFiles: ['jest-date-mock'],
}
