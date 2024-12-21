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
    const cwdLen = process.cwd().length;
    // cwd F:\Github\repos\editpress-org\editpress\packages\vuepress-plugin-editable>


    const { filePath } = page
    console.log('extendsPage=>', page.data.filePathRelative);
    console.log('node extendsPage 1 =>', page.filePath);
    console.log('node extendsPage 2 =>', page.filePathRelative);
    console.log('node extendsPage 2 =>', app.options.source);
    const { theme,...otherOptions }= app.options
    console.log('node otherOptions=>', otherOptions);

    console.log('node extendsPage 3 =>', filePath);

    // node extendsPage 1 => F:/Github/repos/editpress-org/editpress/vuepress-docs/docs/get-started.md
    // node extendsPage 2 => get-started.md
    // node extendsPage 2 => F:/Github/repos/editpress-org/editpress/vuepress-docs/docs

    page.remoteRelativePath = filePath?.substring(cwdLen).replace(/\\/g, '/');

    console.log('基于仓库的文件地址------->', page.remoteRelativePath)

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
