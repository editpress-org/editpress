import { h, defineComponent } from 'vue'
import type { VNode } from 'vue'
import './index.module.css'

export default defineComponent({
  name: 'Position',

  props: {
    lines: {
      type: Number,
      default: 0
    }
  },

  setup(props) {

    const spanElements: VNode[] = [];
    for (let i = 1; i <= props.lines; i++) {
      spanElements.push(h('span', { key: i }, i));
    }

    return (): VNode => h('div', {
      class: 'editable-lines'
    }, spanElements)
  }
})

