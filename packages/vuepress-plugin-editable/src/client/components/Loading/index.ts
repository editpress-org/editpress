import { defineComponent, h, ref } from 'vue'
import type { VNode } from 'vue'
import './index.css'

export default defineComponent({
  name: 'Loading',
  setup() {
    return (): VNode => h('div', { class: 'editable-loading', id: 'editable-loading' }, [
      h('div', { class: 'editable-storm-loading' }, 'Loading...')
    ])
  }
})
