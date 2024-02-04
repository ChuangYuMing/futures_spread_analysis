module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    project: true,
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ['.eslintrc.cjs'],
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      files: ['./**/*.{ts,tsx}']
    }
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint'],
  root: true,
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      { ignores: ['modules'] }
    ]
  }
}
