/**
 * temp handler
 * event bus
 *
 */
import { createApp} from "vue";
const bus = createApp({
  setup(){
    defineEmits(['showLoading'])
  }
})
export default bus;
