import { defineClientConfig } from 'vuepress/client';
import type { App, Page } from 'vuepress/core';
import EditableReview from './components/Review.vue';
import EditableLoading from './components/Loading.vue';
import EditablePoptip from './components/Poptip.vue';
import setup from './setup';

export default defineClientConfig({
  /** enhance */
  enhance({ app, router }) {
    app.component('EditableReview', EditableReview);
    app.component('EditableLoading', EditableLoading);
    app.component('EditablePoptip', EditablePoptip);
  },
  // emits: ['showLoading', 'showReview', 'onClose', 'onReceive'],
  setup(){
    console.log('options=>',this)
  },
});
