/**
 * entry for node
*/
import { configAPI } from '../shared/config.js';
import type { App, Page } from 'vuepress/core';
import type { Markdown } from 'vuepress/markdown';
import { generateLine } from './line.js';
import { path, getDirname } from 'vuepress/utils';
import pkg from '../../package.json'  with {type: "json"}

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
  // name: JSON.stringify(require('../../package.json').name),
  name: pkg.name,
  extendsMarkdown(md: Markdown, app: App) {
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
    // 透传给 client
    page.data.editableData = {
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
});
