export default {
  '*.{js,ts}': ['npm run lint'],
  '**/*.ts?(x)': () => 'npm run lint:ts'
}
