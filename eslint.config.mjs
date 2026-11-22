import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['dist/', 'coverage/', '.wrangler/', 'examples/', 'mocks/', 'tests/mocks/']
  },
  {
    // Flat config lints only .js by default; without this no TypeScript file was ever linted
    files: ['**/*.ts'],
    extends: [js.configs.recommended, typescriptEslint.configs['flat/recommended']],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
      ]
    }
  },
  prettierRecommended
]);
