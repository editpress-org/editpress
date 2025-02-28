import { h, onMounted, render, watch, ref, defineComponent, watchEffect, nextTick } from 'vue'
import type { VNode } from 'vue'
import { fetchOps } from '../../../shared/config';
import { useStore } from '../../useStore'
import { basicSetup, EditorView } from "codemirror"
import { markdown } from "@codemirror/lang-markdown"
import Poptip from '../Poptip';
import './index.css'

export default defineComponent({
  name: 'Review',
  props: ['pageDataProps', 'isEditing'],
  setup(props, { attrs, slots, emit, expose }) {
    const { storeData, actions } = useStore()
    const { content } = props.pageDataProps.value
    const { isEditing } = props
    const { owner, repo } = storeData

    // 定义响应式数据
    const eventData = ref(storeData.reviewData);
    const disabled = ref(false);
    const originContentLine = ref(content?.length);
    const otherDivLine = ref(0);
    const codemirrorRef = ref();

    const poptipData = ref({
      success: false,
      data: {},
      message: ''
    },)

    const destroyCodeMirror = () => {
      const domParent = document.getElementById('editpress-markdown')
      if (domParent instanceof Element) {
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

    const renderPoptip = (status: boolean) => {
      const vNode = h(Poptip, { poptipData: poptipData.value, poptipStatus: status })
      render(vNode, document.body)
    }

    // 应用拉取请求的方法
    const onApplyPullRequest = () => {

      disabled.value = true;

      const newContent = codemirrorRef.value?.state.doc.toString()
      actions.setLoading(true)
      const { editableData } = props.pageDataProps.value
      const { updateAPI, path } = editableData || {};


      fetch(updateAPI, {
        body: JSON.stringify({
          owner,
          repo,
          path,
          content: newContent,
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
          poptipData.value = data
          if (data.success) {
            // TODO ===========
            // setTimeout(() => {
            //   location.reload();
            // }, 5000);
          } else {
            nextTick(() => {
              renderPoptip(false)
            })
          }
          actions.setLoading(false)
        })
        .catch(() => {
          actions.setLoading(false)
        });
    };

    const onMountedMarkdown = (text: string) => {
      const markdownNode = document.getElementById('editpress-markdown')
      if (!markdownNode) return

      codemirrorRef.value = new EditorView({
        doc: text,
        extensions: [basicSetup, markdown(), EditorView.lineWrapping,],
        parent: markdownNode,
      })


    }
    onMounted(() => {
      originContentLine.value = countOriginContent(content);
      // console.log(' Review 挂载 storeData=>', content)

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

    if (!isEditing) return null

    return vNode
  }
})