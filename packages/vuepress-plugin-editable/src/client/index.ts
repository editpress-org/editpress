import { defineClientConfig } from 'vuepress/client';
import EditableReview from './components/Review';
import EditableLoading from './components/Loading';
import EditablePoptip from './components/Poptip';
import setup from './setup';

export default defineClientConfig({
  // TODO 可能并不需要~
  enhance({ app }) {
    app.component('EditableReview', EditableReview);
    app.component('EditableLoading', EditableLoading);
    app.component('EditablePoptip', EditablePoptip);
  },
  setup
});
