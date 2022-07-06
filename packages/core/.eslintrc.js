module.exports = {
  ...require('@planet-graphql/config/eslint-preset.js'),
  root: true,
  parserOptions: {
    project: './tsconfig.json',
  },
}
