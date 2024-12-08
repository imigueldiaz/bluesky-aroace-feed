import eslint from '@eslint/js';
import globals from 'globals';
import prettierConfig from './prettier.config.js';

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      // Prettier rules
      'prettier/prettier': ['error', prettierConfig],
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
  },
];
