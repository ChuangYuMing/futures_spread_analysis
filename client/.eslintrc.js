module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['react', 'prettier'],
  extends: ['react-app', 'airbnb', 'prettier'],
  rules: {
    'no-return-assign': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    radix: ['error', 'as-needed'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true
      }
    ],
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.js', '.jsx']
      }
    ],
    'react/no-this-in-sfc': ['off'],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id']
        }
      }
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        required: {
          some: ['nesting', 'id']
        }
      }
    ]
  }
}
