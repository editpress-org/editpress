import { h, ref, onMounted, defineComponent, computed } from 'vue';
import type { VNode } from 'vue'
import { useStore } from '../../useStore';
import './index.css'

// 定义处理消息的方法
const subMessage = (str: string) => {
  return (str || '').replace(/^.*: /g, '');
};

export default defineComponent({
  name: 'Poptip',
  setup() {

    const { storeData } = useStore();
    const res = ref(storeData.poptipData);
    const status = ref(storeData.status);

    const borderColor = computed(() => {
      if (res.value.success) {
        return '#3eaf7c';
      } else {
        return '#eb7350';
      }
    })

    // 定义关闭弹框的方法
    const closePoptip = () => {
      status.value = false;
      if (!res.value.success) {
        location.reload();
      }
    };

    if (!status) {
      return null;
    }

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
        h('a', { href: res.value.data && res.value.data.html_url, target: '_blank' }, 'Pull Request')
      ]);
    }
    return (): VNode => h('div', {
      class: 'editable-poptip',
      // TODO bug
      directives: [{ name: 'if', value: status.value }],
      style: { borderColor: borderColor.value }
    }, [
      // div 1
      h('div', firstDivContent),

      secondDivContent,

      // div4
      h('div', {
         // TODO bug
        directives: [{ name: 'if', value: !res.value.success && res?.value.not_found_repo_link }],
      }, [
        'See:',
        h('a', { href: res.value.data && res.value.not_found_repo_link, target: '_blank' }, res.value.data?.repo)
      ])
    ]);
  },
});