import { configAPI } from './config';
import type { App, Page } from 'vuepress/dist/core';
import type { Markdown } from 'vuepress/dist/markdown';
import { generateLine } from './line';
const { _appDomain, _redirectAPI, _clientId, _updateAPI, _getContentAPI, _githubOAuthUrl } = configAPI;

interface Options {
  appDomain?: string;
  getContentAPI?: string;
  updateAPI?: string;
  redirectAPI?: string;
  clientId?: string;
  canReview?: boolean;
}

export const editablePlugin = (options: Options) => ({
  name: 'vuepress-plugin-editable',
  extendsMarkdown(md: Markdown, app: App) {
    md.use(generateLine, app);
  },
  extendsPage(page: Page, app: App) {
    const { _context, filePath = '' } = page;
    const cwdLen = 222; // TODO
    // const cwdLen = _context.cwd.length;

    console.log('extendsPage=>', page);
    page.remoteRelativePath = filePath?.substring(0, cwdLen).replace(/\\/g, '/');
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
});
