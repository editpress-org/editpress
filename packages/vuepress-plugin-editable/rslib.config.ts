import { pluginVue } from '@rsbuild/plugin-vue';
import { defineConfig } from '@rslib/core';


const shared = {
  dts: {
    bundle: true,
  },
};
export default defineConfig({
  source: {
    entry: { index: './src/node/index.ts' },
  },
  plugins: [pluginVue()],
  lib: [{
    format: 'cjs', ...shared, output: {
      target: 'node',
      distPath: {
        root: 'dist/node',
      },
    }
  }],
  // output: {
  //   target: 'node',
  //   distPath: {
  //     root: 'dist/main',
  //   },
  // },
});
