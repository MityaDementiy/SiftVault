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
  plugins: ['react-compiler'],
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
  ignorePatterns: ['dist', 'routeTree.gen.ts', '.tanstack', '.eslintrc.cjs'],
  rules: {
    'react-compiler/react-compiler': 'error',
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
        'src/routes/__root.tsx',
      ],
    }],
    'no-restricted-imports': ['warn', {
      patterns: [
        {
          group: ['react'],
          importNames: ['useState'],
          message: 'useState is forbidden — use a Zustand store instead (see CLAUDE.md).',
        },
        {
          group: ['react'],
          importNames: ['useMemo'],
          message: 'This project uses React Compiler, which handles memoization automatically — double check whether you actually need useMemo.',
        },
        {
          group: ['react'],
          importNames: ['useCallback'],
          message: 'This project uses React Compiler, which handles memoization automatically — double check whether you actually need useCallback.',
        },
        {
          group: ['react'],
          importNames: ['memo'],
          message: 'This project uses React Compiler, which handles memoization automatically — double check whether you actually need memo.',
        },
      ],
    }],
    'no-restricted-properties': ['warn',
      {
        object: 'React',
        property: 'useState',
        message: 'useState is forbidden — use a Zustand store instead (see CLAUDE.md).',
      },
      {
        object: 'React',
        property: 'useMemo',
        message: 'This project uses React Compiler, which handles memoization automatically — double check whether you actually need useMemo.',
      },
      {
        object: 'React',
        property: 'useCallback',
        message: 'This project uses React Compiler, which handles memoization automatically — double check whether you actually need useCallback.',
      },
      {
        object: 'React',
        property: 'memo',
        message: 'This project uses React Compiler, which handles memoization automatically — double check whether you actually need memo.',
      },
    ],
  },
};
