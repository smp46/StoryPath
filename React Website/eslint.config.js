import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginN from 'eslint-plugin-n';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser'; // Import the parser separately

export default [
  // Apply configuration to all JS, TS, and JSX/TSX files
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},

  // Set the global variables
  {languageOptions: {globals: globals.browser}},

  // Ignore certain files
  {ignores: ['.*', 'tailwind.config.js']},

  // Apply the base recommended configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Define plugins as objects
  {
    plugins: {
      n: pluginN,
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'block-scoped-var': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eol-last': 'error',
      'prefer-arrow-callback': 'error',
      'no-trailing-spaces': 'error',
      quotes: ['warn', 'double', {avoidEscape: true}],
      'no-restricted-properties': [
        'error',
        {object: 'describe', property: 'only'},
        {object: 'it', property: 'only'},
      ],
    },
  },

  // TypeScript-specific overrides
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser, // Use the imported parser here
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: {
      n: pluginN,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-warning-comments': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/camelcase': 'off',
      'n/no-missing-import': 'off',
      'n/no-empty-function': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-missing-require': 'off',
      'n/shebang': 'off',
      'no-dupe-class-members': 'off',
      'require-atomic-updates': 'off',
    },
  },
];
