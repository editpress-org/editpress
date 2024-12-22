import { pluginVue } from '@rsbuild/plugin-vue';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [pluginVue()],
  lib: [{
    format: 'esm', source: {
      entry: { index: "./src/client/index.ts" }
    }
  }],
  output: {
    target: 'web',
  },
});