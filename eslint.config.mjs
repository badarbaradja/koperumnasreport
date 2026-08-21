import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // react-hook-form's `useController`/`useFormContext` return a `field` object
    // that mixes a real ref (`field.ref`) with plain values (`field.value`,
    // `field.name`). The new `react-hooks/refs` rule (from the React Compiler-era
    // eslint-plugin-react-hooks bundled with Next.js 16) can't tell them apart and
    // flags every property read on that object as an illegal ref-during-render
    // access — a known false positive for this exact react-hook-form pattern, not
    // a real bug. `FormRenderer` and `components/fields/*` rely on reading
    // `field.value`/`field.name` during render (e.g. `Uang.tsx` formats the
    // displayed Rupiah string from `field.value`), so this can't be refactored
    // away without dropping controlled-field formatting. Disabled project-wide.
    rules: {
      "react-hooks/refs": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
