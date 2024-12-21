import { defineClientConfig } from 'vuepress/client';
import type { App, Page } from 'vuepress/core';
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
    console.log('client app=>', app)
  },

  emits: ['showLoading', 'showReview', 'onClose', 'onReceive'],
  setup,
});
