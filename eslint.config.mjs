import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores — replaces legacy .eslintignore
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'web-build/**',
      'babel.config.js',
      'metro.config.js',
      'tailwind.config.js',
    ],
  },

  // All TypeScript source files
  {
    files: ['**/*.{ts,tsx}'],

    extends: [...tseslint.configs.recommended],

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSort,
    },

    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: { version: 'detect' },
    },

    rules: {
      // — TypeScript —
      // Prefix with _ to silence: `const _unused = ...`
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // `any` is sometimes unavoidable in catch blocks; warn but don't block
      '@typescript-eslint/no-explicit-any': 'warn',
      // Enforce `import type` for type-only imports — matches existing codebase style
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      // No CommonJS require() in TypeScript files; use ES imports
      '@typescript-eslint/no-require-imports': 'error',

      // — React —
      'react/react-in-jsx-scope': 'off', // Not needed with Expo's new JSX transform
      'react/prop-types': 'off', // TypeScript handles prop validation
      'react/self-closing-comp': 'error',
      // Prevent unnecessary braces: label="text" not label={"text"}
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // — React Hooks —
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // — Import sorting (autofixable) —
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // — General —
      // console.warn/error are fine; console.log is a sign of debug leftovers
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Prettier MUST be last — disables all ESLint formatting rules that would conflict
  eslintConfigPrettier,
);
