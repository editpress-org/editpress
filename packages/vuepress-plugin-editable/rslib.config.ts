import { pluginVue } from '@rsbuild/plugin-vue';
import { defineConfig } from '@rslib/core';
import { resolve } from 'node:path'


export default defineConfig({
  plugins: [pluginVue()],
  lib: [{
    format: 'esm', syntax: "es2022", source: {
      entry: { index: resolve(__dirname, "src/node/index.ts") }
    }
  }],
  output: {
    target: 'node',
    distPath: {
      root: 'dist'
    }
  },
});