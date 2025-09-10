import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier/recommended";
import vueConfigTypescript from "@vue/eslint-config-typescript";
import vueConfigPrettier from "@vue/eslint-config-prettier";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // js
  pluginJs.configs.recommended,

  // ts
  ...tsEslint.configs.recommended,

  // vue
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tsEslint.parser,
      },
    },
  },
  {
    rules: {
      ...vueConfigTypescript.rules,
      ...vueConfigPrettier.rules,
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          printWidth: 120,
          trailingComma: "es5",
          tabWidth: 2,
        },
      ],
      "vue/multi-word-component-names": "off",
      "vue/attribute-hyphenation": "off",
      "vue/no-v-html": "off",
      "vue/v-on-event-hyphenation": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // prettier
  prettier,

  {
    ignores: ["dist/", "public/", "node_modules/", "storybook-static/", "*.min.js"],
  },
];
