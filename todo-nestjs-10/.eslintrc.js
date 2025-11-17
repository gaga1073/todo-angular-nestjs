module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'unused-imports'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
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

    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    'no-console': ['warn', { allow: ['info', 'error', 'warn'] }],

    'unused-imports/no-unused-imports': 'error',

    'no-restricted-imports': [
      'error',
      {
        patterns: [
          'src/*', // src直書き禁止
          './*', // 相対禁止
          '../*', // 相対禁止
        ],
      },
    ],

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'sibling', 'parent', 'object', 'type', 'index'],
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
  overrides: [
    {
      files: ['./prisma/**'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
};
