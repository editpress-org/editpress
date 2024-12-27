import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// diff: dist-vue-tsc dist-vue
const diffList = [
  'client/components/Loading/index.js',
  'client/components/Loading/index.module.js',
  'client/components/Loading/index_module.css',

  'client/components/Poptip/index.js',
  'client/components/Poptip/index.module.js',
  'client/components/Poptip/index_module.css',

  'client/components/Position/index.js',
  'client/components/Position/index.module.js',
  'client/components/Position/index_module.css',

  'client/components/Review/index.js',
  'client/components/Review/index.module.js',
  'client/components/Review/index_module.css',

  'client/config.js',
  'client/index.js',
  'client/setup.js',
  'client/style.css',
  'node/eventBus.js',
  'node/index.js',
  'node/line.js',
  'shared/config.js',
  'typings.d.js',
];

describe('node diff', async () => {
  diffList.filter(it => !it.endsWith('.css')).map(async (item) => {
    it(`diff dist/${item} <——> dist-vue/${item}`, async () => {
      const content1 = await readFile(resolve(__dirname, `../dist/${item}`), 'utf-8');
      const content2 = await readFile(resolve(__dirname, `../dist-vue/${item}`), 'utf-8');
      // const content3 = await readFile(resolve(__dirname, `../dist/${item}`), 'utf-8');

      // console.log('content1=>', content1)
      // console.log('content2=>', content2)
      expect(content1).toEqual(content2)
    });
  });
});
