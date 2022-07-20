module.exports = {
  extends: ['plugin:unicorn/recommended', 'standard-with-typescript', 'prettier'],
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'type'],
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-default-export': 'error',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-object-from-entries': 'off',
    'unicorn/no-null': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/prefer-top-level-await': 'off',
  },
}
