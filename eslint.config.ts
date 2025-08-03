import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  // @ts-expect-error incompatibilities between ESLint built-in types and the types used by typescript-eslint
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    files: ["**/*.vue"],
    languageOptions: {
      globals: {
        definePage: "readonly"
      }
    },
    rules: {
      "vue/multi-word-component-names": "off"
    },
    settings: {
      "import/core-modules": ["vue-router/auto-routes"]
    },
    
  },
  
]);
