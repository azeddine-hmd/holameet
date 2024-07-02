import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      "@typescript-eslit/no-explicit-any": ["off"],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
