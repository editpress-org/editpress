import { defineClientConfig } from 'vuepress/client';
import EditableReview from './components/Review';
import EditableLoading from './components/Loading';
import EditablePoptip from './components/Poptip';
import EditpressLayout from './components/EditpressLayout';
import setup from './setup';

export default defineClientConfig({
  enhance({ app }) {
    app.component('EditableReview', EditableReview);
    app.component('EditableLoading', EditableLoading);
    app.component('EditablePoptip', EditablePoptip);
  },
  setup,
  // layout frontmatter 使用
  layouts: {
    EditpressLayout
  },
});
