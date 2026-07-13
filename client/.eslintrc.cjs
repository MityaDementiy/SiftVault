module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist', 'routeTree.gen.ts', '.tanstack'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        'vite.config.ts',
        'vitest.config.ts',
        'vitest.setup.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    }],
  },
};
