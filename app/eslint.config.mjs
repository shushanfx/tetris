// import "@rushstack/eslint-patch/modern-module-resolution";
import js from "@eslint/js";
import pluginVue from 'eslint-plugin-vue';
import tseslint from "typescript-eslint";
import vueParser from 'vue-eslint-parser';
// import vue3Typescript from '@vue/eslint-config-typescript';
export default [
  {
    files: ["**/*.vue", "**/*.ts"]
  },
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser, // 在vue文件上使用ts解析器
        sourceType: 'module'
      }
    }
  },
];