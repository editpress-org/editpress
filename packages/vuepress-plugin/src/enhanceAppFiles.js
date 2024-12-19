import EditableReview from "./components/Review";
import EditableLoading from "./components/Loading";
import EditablePoptip from "./components/Poptip";
export default ({ Vue }) => {
  // eslint-disable-next-line vue/match-component-file-name
  Vue.component("EditableReview", EditableReview);
  Vue.component("EditableLoading", EditableLoading);
  Vue.component("EditablePoptip", EditablePoptip);
};
