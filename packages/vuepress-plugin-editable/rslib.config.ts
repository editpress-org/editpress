import { pluginVue } from '@rsbuild/plugin-vue';
import { defineConfig } from '@rslib/core';
import type { Compiler, RspackPluginInstance } from '@rspack/core';
import { resolve } from 'node:path'
import { exec } from 'node:child_process';
import path from 'path';
// import { libCssExtractLoader } from '@rslib/core/'

// const currentModuleUrl = import.meta.resolve('@rslib/core');
// const currentModuleUrl = require.resolve('@rslib/core')

const tscPlugin = () => ({
  name: 'tsc-plugin',
  setup(api) {
    api.onBeforeBuild(({ isFirstCompile, stats }) => {

      exec('npx vue-tsc', (err, stdout, stderr) => {
        if (err) {
          console.error('err=>', err);
          return;
        }
        console.log('vue-tsc build done=>', stdout);
      });
    });
  }
})

export default defineConfig({
  // tscPlugin(),
  plugins: [pluginVue(),],
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      bundle: false, // true 单个文件
      // source: {
      //   // entry: { index: ".src/**" }
      //   entry: { index: resolve(__dirname, "src/node/index.ts") }
      // },
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
    // cssModules: {
    //   namedExport: true,
    //   mode: 'icss',
    //   // mode: 'global', local pure icss
    //   auto: (resource) => {
    //     console.log('auto=>', resource, resource.includes('.module.'))
    //     return resource.includes('.module.') || resource.includes('shared/');
    //   },
    // },
    // 手动处理 css
    // copy: [
    //   {
    //     from: "src/**/*.module.css",
    //     // 替换掉 src => dist
    //     to: ({ absoluteFilename }) => {
    //       const distPath = resolve(__dirname, 'dist')
    //       const srcPath = resolve(__dirname, 'src')
    //       return absoluteFilename?.replace(srcPath, distPath) as string
    //     },
    //     force: true,
    //   }
    // ]
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          // '@internal': '@vuepress/plugin-theme-data',
        },
      },

      experiments:{
        outputModule: true,
      },
      // externalsPresets: {
      //   electronRenderer: true,
      // },
      externalsType: 'window',
      // externalsType: 'module-import',
      // externals: {
      //   vue: 'vue',
      // }
    }
  },
});
/**
 * externalsType 并没有提供一种认为模式的，跟手写 esm 那种
 * https://rspack.dev/zh/config/externals#externalstype
*/