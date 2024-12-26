import { pluginVue } from '@rsbuild/plugin-vue';
import { defineConfig } from '@rslib/core';
import { resolve } from 'node:path'
import { exec } from 'node:child_process';

const tscPlugin = () => ({
  name: 'tsc-plugin',
  setup(api) {
    api.onBeforeBuild(({ isFirstCompile, stats }) => {
      exec('npx vue-tsc', (err, stdout, stderr) => {
        if (err) {
          console.error('err=>', err);
          return;
        }
        console.log('vue-tsc build done=>',stdout);
      });
    });
  }
})

export default defineConfig({
  plugins: [pluginVue(), tscPlugin()],
  lib: [{
    format: 'esm', syntax: "es2022", source: {
      entry: { index: resolve(__dirname, "src/node/index.ts") }
    }
  }],
  output: {
    target: 'node',
    distPath: {
      root: 'dist'
    },
    // 手动处理 css
    copy: [
      {
        from: "src/**/*.module.css",
        // 替换掉 src => dist
        to: ({ absoluteFilename }) => {
          const distPath = resolve(__dirname, 'dist')
          const srcPath = resolve(__dirname, 'src')
          return absoluteFilename?.replace(srcPath, distPath) as string
        },
        force: true,
      }
    ]
  },
  // tools: {
  //   rspack: {
  //     devServer: {
  //       writeToDisk: true
  //     }
  //   }
  // }
});