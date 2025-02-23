
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { h, defineComponent, inject, computed, reactive, ref, watch, onMounted, watchEffect } from "vue";
import type { Ref } from 'vue'
import { usePageData, useClientData, usePageFrontmatter } from 'vuepress/client';
import { offSvgCode, onSvgCode } from '../../../shared/assets';
import { useStore } from "../../useStore";
import type { ExtendPages } from '../../../typings';
import './index.css'

export default defineComponent({
  name: "EditpressLayout",
  setup() {

    const pageData = usePageData() as Record<string, any>
    const { storeData } = useStore()
    const editableData: ExtendPages = pageData.value?.editableData

    const { githubOAuthUrl, clientId, redirectAPI } = editableData || {};
    const href = `${githubOAuthUrl}?client_id=${clientId}&redirect_uri=${redirectAPI}?reference=${window.location.href}`;

    const isEditing = inject('isEditing') as Ref<boolean>

    watch(isEditing, (val) => {
      console.log('oo isEditing=>', val)
    })

    // no auth
    const noAuthVnode = () => h('a', {
      class: ['no-need-close', `editable-menu`],
      style: { display: 'flex', 'margin-top': '4px' },
      href,
      title: '使用 Github 授权 editpress 即可在线编辑，快速修改',
      onClick() {
        console.log('no auth click=>')
      }
    }, [
      h('span', {
        innerHTML: offSvgCode
      }),
      h('span', 'Github OAuth'),
    ])

    // auth
    const authVNode = () => {

      return h('span', {
        class: ['no-need-close', `editable-menu`],
        style: { display: 'flex', 'margin-top': '4px' },
      }, [
        h('span', {
          innerHTML: onSvgCode
        }, ''),

        isEditing.value ?
          h('span', {
            class: ['p4', 'editable-editing'],
          }, ['编', '辑', '中', '~'].map((item, i) => h('span', { style: `--char-index: ${i}` }, item))) :
          h('span', {
            class: ['p4'],
          }, '双击编辑'),
      ])
    }

    '编辑中~'

    // editable-editing

    return () => {
      const renderVNode = storeData.isAuth ? authVNode() : noAuthVnode()

      return h(ParentLayout, {}, {
        'page-content-top': () => h('div', { class: 'editpress-auth-decoration', id: "editpress-page" }, [
          renderVNode,
          // markdown editable node
          h('div', { id: "editpress-markdown" }, [
            h('div', { id: "editpress-markdown-actionBar", })
          ]),
        ]
        )
      })
    }
  }
});
