/**
 * Client setup
*/
import { useThemeData } from '@vuepress/plugin-theme-data/client';
import type { ThemeData } from '@vuepress/plugin-theme-data/client';
import type { GetOriginContent, PostSingleData } from '../typings';
import { h, render, ref, onMounted, provide } from 'vue'
import { fetchOps } from '../shared/config';
import { usePageData, useRoute } from 'vuepress/client';
import { useStore } from './useStore'
import { normalizeNodeInner } from '../shared/tools';
import Review from './components/Review';

export default function setup() {
  const pageData = usePageData() as Record<string, any>
  const { storeData, actions } = useStore()
  const { repo, owner } = storeData
  const router = useRoute()
  const preNode = ref<EventTarget | null>(null)
  const isPlainTextStatus = ref(false)
  const timer = ref()

  /**
   * 
   * @TODO  不知道为什么 无法在 useStore 去配置传递到 layouts，暂时放到顶层 setup 中使用吧
  */
  const isEditing = ref(false)
  provide('isEditing', isEditing)

  const themeData = useThemeData() as ThemeData as unknown as { repo?: string };

  onMounted(() => {
    const targetNode = document.querySelector('body');


    if (targetNode) {
      targetNode.removeEventListener('dblclick', dblClick);
      targetNode.addEventListener('dblclick', dblClick);
    }

    const editpressPageNode = document.getElementById('editpress-page')

    // attachment the id to VP default node
    if (editpressPageNode) {
      const nextSiblingNode = editpressPageNode.nextElementSibling as Element | null
      if (nextSiblingNode) {
        nextSiblingNode.id = 'editpress-default-content'
      }
    }
    saveAccessToken();
  })

  /**
   * review component handler
   * and destroyed the review component
  */
  const onReviewClose = (closeStatus: boolean) => {
    console.log('来自 review 组件，要求关闭=>', closeStatus)
    isEditing.value = closeStatus

    const dom = document.getElementById('editpress-markdown-actionBar')
    const defaultDom = document.getElementById('editpress-default-content')
    if (defaultDom) {
      defaultDom.style.display = 'block'
    }
    if (!(dom instanceof Element)) {
      return
    };
    render(null, dom)

  }

  const renderNoAuthTip = () => {
    const authNode = document.getElementById('editpress-page');
    if (authNode) {
      // 滚动到指定位置
      authNode.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });

      // 检查是否已经存在 editpress-no-auth-tip 元素
      const existingTip = document.getElementById('editpress-no-auth-tip');
      if (existingTip) {
        // 如果存在，则销毁它
        render(null, authNode);
        return
      }

      // 创建新的 VNode
      const vNode = h('div', {
        class: 'editpress-no-auth-tip', id: 'editpress-no-auth-tip',
      }, 'login in here');

      // 渲染新的 VNode
      render(vNode, authNode);

      // 清除之前的定时器（如果有的话）
      if (timer) {
        clearTimeout(timer.value);
      }

      timer.value = setTimeout(() => {
        render(null, authNode);
      }, 2500);
    }
  };


  /**
   * @TODO  debug 测试
  */
  const dblClick = () => {
    if (isEditing.value) {
      return
    }

    if (!storeData.isAuth) {
      renderNoAuthTip()
      return
    }

    const editpressMarkdownNode = document.getElementById('editpress-markdown')
    const editpressMounterNode = document.getElementById('editpress-markdown-actionBar')

    const isMarkdownNode = editpressMarkdownNode instanceof Element
    const isMarkdownContentNode = editpressMounterNode instanceof Element;

    if (!isMarkdownNode || !isMarkdownContentNode) {
      return
    };

    // if editing
    editpressMarkdownNode.style.display = 'block'

    const vNode = h(Review, {
      pageDataProps: pageData,
      isEditing,
      onReviewClose
    })

    const vpDefaultContentNode = document.getElementById('editpress-default-content') as HTMLElement | null
    if (vpDefaultContentNode) {
      vpDefaultContentNode.style.display = 'none'
    }

    isEditing.value = !isEditing.value

    render(vNode, editpressMounterNode)

  };

  const saveAccessToken = () => {
    const { accessToken, login } = router.query;
    if (accessToken) {
      sessionStorage.githubOAuthAccessToken = accessToken;
      sessionStorage.githubLogin = login || '';
    }
  }

  /**
   * @param event
   * */
  const updatePR = () => {
    const repoPrefix = themeData.repo || '';
    if (!repoPrefix || !repoPrefix.length) {
      console.warn('Warning: You have not set the repo url');
      return;
    }
    const node = document.querySelector('.focus-editable');
    const menuNode = document.querySelector('.editable-menu');
    // plain text 模式下，menuNode 不是node 的直接子级
    menuNode && menuNode.remove();

    if (!node) return

    const content = normalizeNodeInner((node as HTMLElement)?.innerText);

    const line = node.getAttribute('data-editable-line');

    if (isPlainTextStatus) {
      onRemoveFocusEditable();
      postSinglePR(owner, repo, pageData.remoteRelativePath, content, Number(line));
    } else {
      getOriginContent(owner, repo, pageData.remoteRelativePath);
    }
  }
  /**
   * handler plain text PR
   */
  const postSinglePR: PostSingleData = (owner, repo, path, content, line) => {
    actions.setLoading(true)
    actions.setClose(true)
    const { updateAPI } = pageData.editableData || {};
    fetch(updateAPI, {
      method: 'POST',
      body: JSON.stringify({
        owner,
        repo,
        path,
        content,
        line: Number(line),
      }),
      ...fetchOps,
      headers: new Headers({
        'Access-Token': sessionStorage.githubOAuthAccessToken,
        'Github-Login': sessionStorage.githubLogin,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        actions.setReviewData(data)
        actions.setLoading(false)
      })
      .catch(() => {
        actions.setLoading(false)
      });
  }



  /**
   * listener contenteditable input
   * contenteditable 里的内容被清空的行为导致丢失 textElement
   * 此举为了不丢失 contenteditbale 特性而追加的
   * @fix 提交只时，移除字符
   */
  const listenerInput = (event: Event) => {
    const { target } = event
    if (!(target instanceof Element)) return;
    target.addEventListener('input', (inputEvent: Event) => {
      const { target: inputTarget } = inputEvent
      if (!(inputTarget instanceof Element)) return;
      const firstTextNode = inputTarget.childNodes[0];
      if (firstTextNode.nodeName !== '#text') {
        console.log('firstTextNode=>', firstTextNode);
        const emptyTextNode = document.createDocumentFragment();
        const aNode = document.createTextNode('\u00A0');
        emptyTextNode.appendChild(aNode);
        inputTarget.insertBefore(emptyTextNode, firstTextNode);
      }
    });
  }


  /**
   * get origin source file content
   */
  const getOriginContent: GetOriginContent = (owner, repo, path) => {
    actions.setLoading(true)
    actions.setClose(true)
    const { getContentAPI } = pageData.editableData || {};
    // owner repo path
    fetch(getContentAPI + '?owner=' + owner + '&repo=' + repo + '&path=' + path, {
      method: 'GET',
      ...fetchOps,
      headers: {
        'Access-Token': sessionStorage.githubOAuthAccessToken,
        'Github-Login': sessionStorage.githubLogin,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        actions.setLoading(false)
        if (data.success) {
          actions.setReviewData({
            status: true,
            owner,
            repo,
            path,
            content: data.data,
          })
        } else {
          actions.setPoptipData(data, true)
        }
      })
      .catch(() => {
        actions.setLoading(false)
      });
  }

  /**
   * remove focus class and contentEditable attribute
   *
   */
  const onRemoveFocusEditable = () => {
    const focusNode = document.querySelector('.focus-editable');
    focusNode?.removeAttribute('contenteditable');
    const editableElement = preNode.value as HTMLElement; // 类型断言
    editableElement?.classList?.remove('focus-editable');
  }
};
