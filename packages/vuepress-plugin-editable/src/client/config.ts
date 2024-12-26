import { defineClientConfig } from 'vuepress/client';
import EditableReview from './components/Review';
import EditableLoading from './components/Loading';
import EditablePoptip from './components/Poptip';
import setup from './setup';

export default defineClientConfig({
  /** 对外暴露组件 */
  enhance({ app, router }) {
    app.component('EditableReview', EditableReview);
    app.component('EditableLoading', EditableLoading);
    app.component('EditablePoptip', EditablePoptip);
  },
  // emits: ['showLoading', 'showReview', 'onClose', 'onReceive'],
  setup
});
