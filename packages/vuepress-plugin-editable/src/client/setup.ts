/**
 * Client setup
*/
import { useThemeData } from '@vuepress/plugin-theme-data/client';
import type { ThemeData } from '@vuepress/plugin-theme-data/client';
import type { BtnWords, ExtendPages, GetOriginContent, PostSingleData } from '../typings';
import { onUnmounted, h, render, ref, onMounted, cloneVNode, createApp, provide } from 'vue'
import { fetchOps } from '../shared/config';
import { usePageData, useRoute } from 'vuepress/client';
import { useStore } from './useStore'
import Review from './components/Review';
import { normalizeNodeInner, reloadPage } from '../shared/tools';

// TODO
export default function setup() {
  const pageData = usePageData() as Record<string, any>
  const { storeData, actions } = useStore()
  const router = useRoute()
  const preLine = ref<number | null>(null)
  const preNode = ref<EventTarget | null>(null)
  const preNodeContent = ref({})
  const isPlainTextStatus = ref(false)

  const isShowReview = ref(false)


  // TODO  这个其实可以优化的
  const themeData = useThemeData() as ThemeData as unknown as { repo?: string };

  onMounted(() => {
    const targetNode = document.querySelector('body');

    if (targetNode) {
      targetNode.removeEventListener('dblclick', dblClick);
      targetNode.addEventListener('dblclick', dblClick);
    }
    saveAccessToken();
  })

  /**
   * 唤起 markdown-it 编辑器
  */
  const onCallMarkdownEditor = (event: Event) => {
  }




  /**
   * review component handler
   * and destroyed the review component
  */
  const onReviewClose = (closeStatus: boolean) => {
    console.log('来着 review 组件，要求关闭=>', closeStatus)
    isShowReview.value = closeStatus

    // editpress-markdown
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

  /**
   * @TODO  debug 测试
  */
  const dblClick = () => {
    console.log('双击')

    if (isShowReview.value) {
      return
    }

    const editpressMarkdownNode = document.getElementById('editpress-markdown')
    const editpressMounterNode = document.getElementById('editpress-markdown-actionBar')

    const isMarkdownNode = editpressMarkdownNode instanceof Element
    const isMarkdownContentNode = editpressMounterNode instanceof Element;

    if (!isMarkdownNode || !isMarkdownContentNode) {
      return
    };

    // isShowReview
    editpressMarkdownNode.style.display = 'block'


    const vNode = h(Review, {
      pageDataProps: pageData,
      onReviewClose
    })
    const isVNode = (editpressMounterNode as any)._vnode?.__v_isVNode;

    const vpDefaultContentNode = document.getElementById('editpress-default-content') as HTMLElement | null
    if (vpDefaultContentNode) {
      vpDefaultContentNode.style.display = 'none'
    }


    isShowReview.value = true;
    console.log('isVNode=>', isVNode)
    render(vNode, editpressMounterNode)

  };

  const saveAccessToken = () => {
    const { accessToken, login } = router.query;
    if (accessToken) {
      sessionStorage.githubOAuthAccessToken = accessToken;
      sessionStorage.githubLogin = login || '';
    }
  }

  const bindMenuEvent = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.classList.contains('editable-apply') || target.classList.contains('editable-update')) {
      updatePR();
    }
    if (target.classList.contains('editable-restore')) {
      reloadPage();
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
    const { owner, repo } = getOwnerRepo(repoPrefix);

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
   * @return {
   *  owner,
   *  repo
   * }
   */
  const getOwnerRepo = (ownerRepo: string) => {
    const strArr = ownerRepo.split('/');
    return {
      owner: strArr[0] ? strArr[0] : '',
      repo: strArr[1] ? strArr[1] : '',
    };
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
  /*
   * 判断是否授权过，即检查本地是否存储 access token
   * @return  {boolean}
   */
  const isOAuthStatus = () => {
    const accessToken = router.query.accessToken;
    return !!(accessToken && accessToken.length === 40);
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

  return () => {
    h('div', 'xx')
  }
};
