/**
 * entry for node
*/
import { configAPI } from '../shared/config.js';
import type { App, Page } from 'vuepress/core';
import type { Markdown } from 'vuepress/markdown';
import { generateLine } from './line.js';
import { path, getDirname } from 'vuepress/utils';
import type { Options } from '../typings.js';

const { appDomain, redirectAPI, clientId, updateAPI, getContentAPI, githubOAuthUrl } = configAPI;

const __dirname = getDirname(import.meta.url)

export const editablePlugin = (options: Options) => ({
  name: "@editpress/vuepress-plugin-editable",
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
    const tempUpdateAPI = (options.appDomain || appDomain) + (options.updateAPI || updateAPI);
    const tempGetContentAPI = (options.appDomain || appDomain) + (options.getContentAPI || getContentAPI);
    const tempRedirectAPI = (options.appDomain || appDomain) + (options.redirectAPI || redirectAPI);
    // 透传给 client
    page.data.editableData = {
      appDomain: options.appDomain || appDomain,
      getContentAPI: tempGetContentAPI,
      updateAPI: tempUpdateAPI,
      redirectAPI: tempRedirectAPI,
      clientId: options.clientId || clientId,
      githubOAuthUrl: githubOAuthUrl,
    };
  },
  define: {
    CAN_REVIEW: options.canReview,
  },
  clientConfigFile: () => {
    return path.resolve(__dirname, '../client/index.js')
  },
});
