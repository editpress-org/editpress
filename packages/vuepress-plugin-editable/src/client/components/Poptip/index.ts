import { h, ref, defineComponent, computed } from 'vue';
import type { VNode } from 'vue'
import './index.css'

// 定义处理消息的方法
const subMessage = (str: string) => {
  return (str || '').replace(/^.*: /g, '');
};

export default defineComponent({
  name: 'Poptip',
  props: ['poptipData', 'poptipStatus'],
  setup(props) {
    const res = ref(props.poptipData);
    const borderColor = computed(() => {
      if (res.value.success) {
        return '#3eaf7c';
      } else {
        return '#eb7350';
      }
    })

    // 定义关闭弹框的方法
    const closePoptip = () => {
      if (!res.value.success) {
        location.reload();
      }
    };

    const firstDivContent = [
      h('strong', res.value.success ? 'Successful！' : 'Warning! '),
      h('span', { class: 'close-poptip', onClick: closePoptip }, 'x')
    ];

    let secondDivContent;
    if (!res.value.success) {
      secondDivContent = h('p', [
        'message: ',
        h('code', { class: 'code' }, subMessage(res.value.message))
      ]);
    } else {
      secondDivContent = h('div', [
        'See: ',
        h('a', { href: res.value.data && res.value.data.html_url, target: '_blank', class: 'editpress-grid' }, 'Pull Request')
      ]);
    }
    const isSuccess = !res.value.success && res?.value.not_found_repo_link

    // rendering no found repo link tip
    let successNode: VNode | null = h('div', {
      directives: [{ name: 'if', value: !res.value.success && res?.value.not_found_repo_link }],
    }, [
      'See:',
      h('a', { href: res.value.data && res.value.not_found_repo_link, target: '_blank', class: 'editpress-grid' }, `${res.value.data?.owner}/${res.value.data?.repo}`)
    ])
    if (!isSuccess) {
      successNode = null
    }
    return (): VNode => h('div', {
      class: 'editable-poptip',
      id: 'editable-poptip',
      style: { borderColor: borderColor.value }
    }, [
      h('div', firstDivContent),
      secondDivContent,
      successNode
    ]);
  },
});