import { h, onMounted, computed, ref, defineComponent } from 'vue'
import type { VNode } from 'vue'
import { fetchOps } from '../../../shared/config';
import { usePageData } from 'vuepress/client';
import Position from '../Position'
import './index.module.css'

export default defineComponent({
  name: 'Review',
  setup() {
    const pageData = usePageData() as Record<string, any>

    // 定义响应式数据
    const eventData = ref({
      content: '',
      status: false,
      owner: '',
      repo: '',
      path: ''
    });
    const disabled = ref(false);
    const originContentLine = ref(0);
    const otherDivLine = ref(0);
    const bodyScrollDefaultValue = ref('');

    // 计算属性 breakLines
    const breakLines = computed(() => originContentLine.value + otherDivLine.value);

    // 定义关闭模态框的方法
    const closeModal = () => {
      location.reload();
    };

    // 防抖函数
    const debounce = (fn, wait) => {
      let timer: ReturnType<typeof setTimeout> | undefined = undefined
      return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(null, args);
        }, wait);
      };
    };

    // 切换页面滚动的方法
    const switchBodyScroll = () => {
      const body: HTMLBodyElement = document.querySelector('body')!;
      if (!body) return
      const tempOverflowValue = body.style.overflow;
      body.style.overflow = 'hidden';
      return tempOverflowValue;
    };

    // 计算原始内容行数的方法
    const countOriginContent = (nodeOrContent, isNode = false) => {
      let lines = 0;
      if (nodeOrContent) {
        let text = '';
        if (isNode) {
          text = nodeOrContent.textContent;
        } else {
          text = nodeOrContent;
        }
        for (const i of text) {
          if (text[i] === '\n') lines++;
        }
      }
      return lines;
    };

    // input事件处理方法
    const onChange = (event) => {
      otherDivLine.value = (event.target.children || []).length;
      const firstTextNode = event.target.childNodes[0];
      const debouncedFn = debounce(() => {
        if (firstTextNode === undefined) originContentLine.value = 1;
        originContentLine.value = countOriginContent(firstTextNode, true);
      }, 100);
      debouncedFn();
    };

    // 应用拉取请求的方法
    const onApplyPullRequest = () => {
      disabled.value = true;
      const contentNode = document.querySelector('.editable-new-content');
      if (!contentNode) return
      const content = (contentNode as HTMLElement)?.innerText as string;
      // bus.$emit('showLoading', true);
      const { updateAPI } = pageData.editableData || {};
      fetch(updateAPI, {
        body: JSON.stringify({
          owner: eventData.value.owner,
          repo: eventData.value.repo,
          path: eventData.value.path,
          content: content,
        }),
        method: 'POST',
        ...fetchOps,
        headers: new Headers({
          'Access-Token': sessionStorage.githubOAuthAccessToken,
          'Github-Login': sessionStorage.githubLogin,
          'Content-Type': 'Application/json',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          disabled.value = false;
          if (data.success) {
            eventData.value.status = false;
            setTimeout(() => {
              location.reload();
            }, 5000);
          }
          switchBodyScroll();
          // bus.$emit('showLoading', false);
          // bus.$emit('onReceive', data, true);
        })
        .catch(() => {
          // bus.$emit('showLoading', false);
          switchBodyScroll();
        });
    };
    // TODO
    onMounted(() => {
      // originContentLine.value = countOriginContent(eventData.value.content);
      console.log('review');
      // bus.$on('showReview', (data) => {
      //   eventData.value = data;
      //   originContentLine.value = countOriginContent(data.content);
      //   bodyScrollDefaultValue.value = switchBodyScroll();
      // });
    });
    return (): VNode => h('div', {
      directives: [{ name: 'if', value: eventData.value.status }],
      style: {
        'z-index': eventData.value.status ? 2 : -1,
      }
    }, [
      h('div', {
        class: 'editable-review-warp'
      }, [
        h(Position, { props: { lines: breakLines } }),
        h('div', { class: 'editable-review-code' }, [
          h('div', { class: 'editable-new-code editable-review-body' }, [

            h('p', {}, [
              'Powered by',
              h('a', { href: 'https://github.com/vuepress/vuepress-plugin-editable/', target: '_blank' }, 'vuepress-plugin-editable'),
              'and',
              h('a', { href: 'https://github.com/veaba/veaba-bot/', target: '_blank' }, 'vuepress-plugin-editable'), 'veaba-bot'
            ]),
            // TODO 重构
            h('pre', { class: 'editable-new-content', contenteditable: true, onInput: onChange }, eventData.value.content),
            h('div', { class: 'editable-review-btn', }, [
              h('button', {
                disabled: disabled.value,
                onClick: onApplyPullRequest
              }, '应用(Apply)'),
              h('button', {
                onClick: closeModal
              }, '关闭(Close)'),
            ]),
          ]),
        ])
      ])
    ])
  }
})