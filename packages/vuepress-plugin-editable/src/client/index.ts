import { defineClientConfig } from 'vuepress/client';
import EditableReview from './components/Review';
import EditableLoading from './components/Loading';
import EditablePoptip from './components/Poptip';
import EditpressLayout from './components/EditpressLayout';
import setup from './setup';
import '../shared/global.css'

export default defineClientConfig({
  enhance({ app }) {
    // 提供给 vuepress docs 层使用
    app.component('EditableReview', EditableReview);
    app.component('EditableLoading', EditableLoading);
    app.component('EditablePoptip', EditablePoptip);
  },
  setup,
  layouts: {
    EditpressLayout
  },
});
