import { defineClientConfig } from 'vuepress/client';
import type { App, Page } from 'vuepress/dist/core';
import EditableReview from './components/Review.vue';
import EditableLoading from './components/Loading.vue';
import EditablePoptip from './components/Poptip.vue';
import setup from './setup';

export default defineClientConfig({
  name: "Editable-client",
  /** enhance */
  enhance({ app, router }) {
    app.component('EditableReview', EditableReview);
    app.component('EditableLoading', EditableLoading);
    app.component('EditablePoptip', EditablePoptip);
  },

  enhancePage(page: Page, app) {

    
    // _filePath==> F:\Github\veaba\vuepress-plugin-editable\docs\README.md
    // cwd==> F:\Github\veaba\vuepress-plugin-editable
    // $page.remoteRelativePath==> /docs/README.md
    console.log('client app=>', app)
    // extend page data
    // const { _context, filePath = '' } = page;
    // const cwdLen = _context.cwd.length;
    // page.remoteRelativePath = filePath?.substring(0, cwdLen).replace(/\\/g, '/');
    // const tempUpdateAPI = (options.appDomain || _appDomain) + (options.updateAPI || _updateAPI);
    // const tempGetContentAPI = (options.appDomain || _appDomain) + (options.getContentAPI || _getContentAPI);
    // const tempRedirectAPI = (options.appDomain || _appDomain) + (options.redirectAPI || _redirectAPI);
    // page.$editable = {
    //   appDomain: options.appDomain || _appDomain,
    //   getContentAPI: tempGetContentAPI,
    //   updateAPI: tempUpdateAPI,
    //   redirectAPI: tempRedirectAPI,
    //   clientId: options.clientId || _clientId,
    //   githubOAuthUrl: _githubOAuthUrl,
    // };
  },

  emits: ['showLoading', 'showReview', 'onClose', 'onReceive'],
  setup,
});
