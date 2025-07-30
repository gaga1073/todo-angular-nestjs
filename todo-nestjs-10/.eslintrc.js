module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'unused-imports'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',

    'no-console': ['warn', { allow: ['info', 'error', 'warn'] }],

    'unused-imports/no-unused-imports': 'error',

    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'sibling',
          'parent',
          'object',
          'type',
          'index',
        ],
        alphabetize: { order: 'asc', caseInsensitive: false },
        'newlines-between': 'never',
        pathGroups: [
          {
            pattern: '@storybook/**',
            group: 'external',
            position: 'before',
          },
        ],
      },
    ],
  },
};
