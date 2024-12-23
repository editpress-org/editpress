/**
 * entry for node
*/
import { configAPI } from '../shared/config.js';
import type { App, Page } from 'vuepress/core';
import type { Markdown } from 'vuepress/markdown';
import { generateLine } from './line.js';
import { path, getDirname } from 'vuepress/utils';
import pkg from '../../package.json' with {type: "json"}

const { _appDomain, _redirectAPI, _clientId, _updateAPI, _getContentAPI, _githubOAuthUrl } = configAPI;

interface Options {
  appDomain?: string;
  getContentAPI?: string;
  updateAPI?: string;
  redirectAPI?: string;
  clientId?: string;
  canReview?: boolean;
}
const __dirname = getDirname(import.meta.url)

export const editablePlugin = (options: Options) => ({
  name: pkg.name,
  extendsMarkdown(md: Markdown, app: App) {
    console.log('extendsMarkdown=>')
    md.use(generateLine, app);
  },
  /**
   * 对 page data 附加新属性~
  */
  extendsPage(page: Page) {
    const cwdLen = process.cwd().length;
    const { filePath } = page
    page.remoteRelativePath = filePath?.substring(cwdLen).replace(/\\/g, '/');
    const tempUpdateAPI = (options.appDomain || _appDomain) + (options.updateAPI || _updateAPI);
    const tempGetContentAPI = (options.appDomain || _appDomain) + (options.getContentAPI || _getContentAPI);
    const tempRedirectAPI = (options.appDomain || _appDomain) + (options.redirectAPI || _redirectAPI);
    page.$editable = {
      appDomain: options.appDomain || _appDomain,
      getContentAPI: tempGetContentAPI,
      updateAPI: tempUpdateAPI,
      redirectAPI: tempRedirectAPI,
      clientId: options.clientId || _clientId,
      githubOAuthUrl: _githubOAuthUrl,
    };
  },
  define: {
    CAN_REVIEW: options.canReview,
  },
  // TODO clientConfigFile  hook
  // enhanceAppFiles: [resolve(__dirname, 'enhanceAppFiles.js')],
  // TODO clientConfigFile  hook
  // globalUIComponents: ['EditableReview', 'EditableLoading', 'EditablePoptip'],

  // TODO clientConfigFile  hook
  // clientRootMixin: resolve(__dirname, 'client.js'),

  // TODO=====
  // clientConfigFile: resolve(__dirname, 'client.config.js'),
  // clientConfigFile: () => {
  //   return path.resolve(process.__dirname, './client/config.js');
  //   // return path.resolve(process.__dirname, './client/config.js');
  // },
  clientConfigFile: (app) => {
    console.log('clientConfigFile=>')
    return path.resolve(__dirname, '../client/config.js')
  },
  onInitialized(app: App) {
    console.log('onInitialized=>', '初始化后被立即调用');
  },
  //  VuePress App 完成文件准备后被立即调用
  onPrepared() {
    console.log('onPrepared=>', 'file ready');
    // console.log('onPrepared app=>', app);')
  },
  onWatched(app: App, watchers, restart) {
    console.log('onWatched watchers=>');
  },
  onGenerated(app: App) {
    console.log('onGenerated=>', '静态构建完成');
  },
});
