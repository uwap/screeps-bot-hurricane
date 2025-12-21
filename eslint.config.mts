import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js,
      "@stylistic": stylistic
    },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "@stylistic/max-len": ["error", { code: 80, tabWidth: 2 }],
    }
  },
  tseslint.configs.recommended,
  stylistic.configs.customize({
    quotes: "double",
    semi: true,
  })
]);
