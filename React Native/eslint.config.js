const prettierConfig = require("eslint-config-prettier");

module.exports = [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ignores: ["node_modules", "dist", "build"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        __DEV__: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "react-native": require("eslint-plugin-react-native"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "off",
      "no-unused-vars": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  prettierConfig,
];
