module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-console': 'off',
  },
};
