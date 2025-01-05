
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { h, defineComponent, computed, reactive, ref, watch } from "vue";
import { usePageData } from 'vuepress/client';
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
    const authVNode = () => h('span', {
      class: ['no-need-close', `editable-menu`],
      style: { display: 'flex', 'margin-top': '4px' },
    }, [
      h('span', {
        innerHTML: onSvgCode
      }, ''),
      h('span', {
        class: ['p4']
      }, '编辑'),
    ])
    // TODO
    const btnEditVnode = [
      h('span', {
        class: ['no-need-close', 'editable-apply', 'p4'],
        onClick() {
          console.log('应用=>')
        },
      }, '应用'),
      h('span', {
        class: ['no-need-close', 'editable-restore', 'p4'],
        onClick() {
          location.reload();
        },
      }, '还原'),
    ]

    return () => {
      const renderVNode = storeData.isAuth ? authVNode() : noAuthVnode()

      return h(ParentLayout, {}, {
        'page-content-top': () => h('div', { class: 'editpress-auth-decoration', id: "editpress-page" }, [
          renderVNode,
        ]
        )
      })
    }
  }
});
