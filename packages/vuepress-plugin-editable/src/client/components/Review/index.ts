import { h, onMounted, computed, ref, defineComponent } from 'vue'
import type { VNode } from 'vue'
import { fetchOps } from '../../../shared/config';
import { useStore } from '../../useStore'
import { basicSetup, EditorView } from "codemirror"
import { markdown } from "@codemirror/lang-markdown"

import './index.css'

// TODO 如何使用 markdown 编辑器，把 一个 id 进行编辑器化？？

export default defineComponent({
  name: 'Review',
  props: ['pageDataProps'],
  setup(props, { attrs, slots, emit, expose }) {
    const { storeData, actions } = useStore()
    const { content } = props.pageDataProps.value
    const isShowReview = ref(true)

    // console.log('Review content=>', content)

    // 定义响应式数据
    const eventData = ref(storeData.reviewData);
    const disabled = ref(false);
    const originContentLine = ref(content?.length);
    const otherDivLine = ref(0);
    const codemirrorRef = ref();

    const destroyCodeMirror = () => {
      const domParent = document.getElementById('editpress-markdown')
      if (domParent instanceof Element) {
        console.log('editpress-markdown-actionBar=>', domParent)
        if (codemirrorRef.value) {
          codemirrorRef.value?.destroy();
        }
      }
    }

    // 定义关闭模态框的方法
    const closeModal = () => {
      destroyCodeMirror()
      emit('reviewClose', false)
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
      actions.setLoading(true)

      const pageData = props.pageDataProps.value
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
          actions.setLoading(false)
          actions.setReviewData(data)
        })
        .catch(() => {
          actions.setLoading(false)
          switchBodyScroll();
        });
    };

    const onMountedMarkdown = (text: string) => {
      const markdownNode = document.getElementById('editpress-markdown')
      if (!markdownNode) return

      codemirrorRef.value = new EditorView({
        doc: text,
        extensions: [basicSetup, markdown(),EditorView.lineWrapping,],
        parent: markdownNode,
      })

    }
    onMounted(() => {
      originContentLine.value = countOriginContent(content);
      console.log(' Review 挂载 storeData=>', storeData)

      // mounted markdown
      onMountedMarkdown(content)
    });

    const vNode = (): VNode => h('div', {
      id: "editpress-review",
      style: {
        'z-index': eventData.value.status ? 2 : -1,
        background: '#fff'
      }
    }, [
      h('div', {
        class: 'editable-review-warp',
      }, [
        h('div', { class: 'editable-review-code' }, [
          h('div', { class: 'editable-new-code editable-review-body' }, [

            h('div', {}, [
              'Powered by ',
              h('a', { href: 'https://github.com/vuepress/vuepress-plugin-editable/', target: '_blank' }, 'vuepress-plugin-editable'),
              ' and ',
              h('a', { href: 'https://github.com/veaba/veaba-bot/', target: '_blank' }, 'veaba-bot'),
              h('button', {
                disabled: disabled.value,
                class: 'editable-grid-space',
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

    console.log('isShowReview=>', isShowReview.value)

    if (!isShowReview.value) return h('div',)


    return vNode
  }
})