const preset = require('@planet-graphql/config/eslint-preset.js')

module.exports = {
  root: true,
  extends: preset.extends,
  rules: {
    ...preset.rules,
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
}
