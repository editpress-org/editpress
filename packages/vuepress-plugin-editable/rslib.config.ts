import { pluginVue } from '@rsbuild/plugin-vue';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  plugins: [pluginVue(),],
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      bundle: false, //
      output: {
        externals: ['vue'],
      },
    }],

  source: {
    entry: {
      index: './src/',
    },
  },
  output: {
    target: 'node',
    emitCss: true,
    distPath: {
      root: 'dist'
    },
  },
});
