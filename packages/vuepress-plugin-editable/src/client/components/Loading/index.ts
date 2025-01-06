import { defineComponent, h, ref } from 'vue'
import type { VNode } from 'vue'
import './index.css'

export default defineComponent({
  name: 'Loading',
  setup() {
    const loading = ref(false);
    if (!loading.value) return null
    return (): VNode => h('div', { class: 'editable-loading' }, [
      h('div', { class: 'editable-storm-loading' }, 'Loading...')
    ])
  }
})
