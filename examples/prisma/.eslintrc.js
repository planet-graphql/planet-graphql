const preset = require('@planet-graphql/config/eslint-preset.js')

module.exports = {
  root: true,
  extends: preset.extends,
  rules: {
    ...preset.rules,
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: ['src/planet-graphql/*', 'src/prisma-client/*'],
}
