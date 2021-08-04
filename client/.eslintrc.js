module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['react', 'prettier'],
  extends: ['react-app', 'airbnb', 'prettier'],
  rules: {
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
    ]
  }
}
