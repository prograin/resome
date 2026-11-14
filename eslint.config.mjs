import { defineConfig, globalIgnores } from "eslint/config";
import next from "@next/eslint-plugin-next";
import hooks from "eslint-plugin-react-hooks";
import accessibility from "eslint-plugin-jsx-a11y";

export default defineConfig([
  {
    files: ["src/**/*.{js,jsx}"],
    extends: [
      next.configs["core-web-vitals"],
      hooks.configs.flat.recommended,
      accessibility.flatConfigs.recommended,
    ],
    rules: { "jsx-a11y/no-noninteractive-tabindex": ["error", { roles: ["region"] }] },
  },
  globalIgnores([".next/**", "out/**", "dist/**", "public/**", "src/generated/**"]),
]);
