module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022
  },
  overrides: [
    {
      files: ['./src/**/*.{ts,tsx}'],
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      },
      extends: ['plugin:@typescript-eslint/recommended-type-checked']
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
