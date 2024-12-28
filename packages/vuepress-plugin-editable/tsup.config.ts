import { defineConfig } from 'tsup';
import glob from 'fast-glob';

const entries = glob.sync(['src/**/*.ts', '!**/*.d.ts']);

export default defineConfig([
  {
    entry: entries,
    target: 'es2022',
    format: ['esm'],
    minify: false,
    clean: true,
    bundle: false,
    dts: false,
    "external": [
      "@internal/routes",
      "@internal/siteData",
      "@internal/themeData"
    ],
  },
]);
