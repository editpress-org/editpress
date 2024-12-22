import { type EnvironmentConfig, RsbuildPlugin } from '@rsbuild/core';
import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import path from 'node:path';



export default defineConfig({
  environments: {
    node: {
      source: {
        // include: './src',
        include: [path.resolve(__dirname, './src/node')],
        entry: {
          index: './src/node/index.ts',
        },
      },
      // plugins: [pluginNodePolyfill()],
      output: {
        target: "node",
        distPath: {
          root: 'dist/node',
          js: '.',
        },
        minify: false,
      },
      performance: {
        chunkSplit: {
          strategy: 'split-by-module',
        },
      },
    },
    // vue: {
    //   source: {
    //     entry: {
    //       index: './src/client/index.ts',
    //     },
    //   },
    //   plugins: [pluginVue()],
    //   output: {
    //     target: "node"
    //   }
    // }
  }
});
