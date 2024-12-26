import { defineComponent, h, ref } from 'vue'
import type { VNode } from 'vue'
import './index.module.css'

export default defineComponent({
  name: 'Loading',
  setup() {
    const loading = ref(false);
    return (): VNode => h('div', { class: 'editable-loading', directives: [{ name: 'if', value: loading.value }] }, [
      h('div', { class: 'editable-storm-loading' }, 'Loading...')
    ])
  }
})
