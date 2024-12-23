// import './style.css';
// import bus from '../node/eventBus';
import { useThemeData } from '@vuepress/plugin-theme-data/client';
import type { ThemeData } from '@vuepress/plugin-theme-data/client';
import { createElementBlock, h, render, ref, onMounted, defineEmits, createApp } from 'vue'
import { fetchOps } from '../shared/config.js';
import { usePageData, useRoute } from 'vuepress/client';
import type { BtnWords, ExtendPages, GetOriginContent, PostSingleData } from '../types';


// TODO
export default function setup() {
  const $page = usePageData() as Record<string, any>

  const router = useRoute()
  const preLine = ref<number | null>(null)
  const preNode = ref<EventTarget | null>(null)
  const preNodeContent = ref({})
  const isPlainTextStatus = ref(false)
  const themeData = useThemeData() as ThemeData as unknown as { repo?: string };

  // TODO how use emit in setup syntax
  const emit = defineEmits(['showLoading', 'showReview', 'onClose', 'onReceive'])

  console.log('themeData=>', themeData)

  onMounted(() => {
    const targetNode = document.querySelector('body');
    if (targetNode) {
      targetNode.removeEventListener('dblclick', dblClick);
      targetNode.addEventListener('dblclick', dblClick);
      targetNode.removeEventListener('click', outsideClick);
      targetNode.addEventListener('click', outsideClick);
    }
    saveAccessToken();
  })

  const dblClick = (event: Event) => {
    const { target } = event
    console.log('双击')
    if (!(target instanceof Element)) return;
    const currentLine = target.getAttribute('data-editable-line');
    if (currentLine || currentLine != null) {
      let oAuth = 'Github OAuth';
      target.classList.add('focus-editable');
      if (!isOAuthStatus()) {
        createMenu(event, { oAuth });
      }
      if (isPlainText(target)) {
        target.classList.remove('no-edit');
        if (isOAuthStatus()) {
          createMenu(event, {
            apply: '应用',
            restore: '还原',
          });
          target.setAttribute('contenteditable', 'true');
          listenerInput(event);
        }
      } else {
        target.classList.add('no-edit');
        if (isOAuthStatus()) {
          createMenu(event, {
            update: '修改',
            restore: '还原',
          });
        }
      }

      preLine.value = Number(currentLine)
      preNode.value = event.target;
      // temp handler 实际上这种处理方式欠妥
      preNodeContent.value = target.innerHTML.replace(/<strong(.+?)strong>/g, '');
    }
  };

  const saveAccessToken = () => {
    const { accessToken, login } = router.query;
    if (accessToken) {
      sessionStorage.githubOAuthAccessToken = accessToken;
      sessionStorage.githubLogin = login || '';
    }
  }
  /**
   * click outside
   */
  const outsideClick = (event: Event) => {
    const { target } = event
    if (!(target instanceof Element)) return;
    const clickLine = target.getAttribute('data-editable-line');
    if (preLine.value && Number(clickLine) !== preLine.value && !target.classList.contains('no-need-close')) {
      if (preNode.value) {
        const editableElement = preNode.value as HTMLElement; // 类型断言
        editableElement.removeAttribute('contenteditable');
        editableElement.classList.remove('focus-editable');
        editableElement.classList.remove('no-edit');
      }
      removeMenu();
    }
    bindMenuEvent(event);
  }
  /**
   * apply menu
   * restore menu
   * @param event
   * @param btnWords { Object}
   * {apply: "应用",
   *   restore: "还原", // redirect update
   *   update: "修改" // call console ui
   * }
  */
  const createMenu = (event: Event, btnWords: BtnWords) => {
    removeMenu();
    const { target } = event
    if (!(target instanceof Element)) {
      return
    };

    const $editable: ExtendPages = $page.value?.$editable;

    // Vue h 函数方式创建
    const vNode = h('strong', {
      class: ['editable-menu', 'no-need-close'],
      props: {
        key: new Date().getTime(),
      },
      contenteditable: false,
    }, [
      Object.entries(btnWords).map(([key, value]) => {
        if (key !== 'oAuth') {
          return h('span', {
            class: ['no-need-close', 'editable-' + key],
            contenteditable: false
          }, value)
        }
        const { githubOAuthUrl, clientId, redirectAPI } = $editable || {};
        const href = `${githubOAuthUrl}?client_id=${clientId}&redirect_uri=${redirectAPI}?reference=${window.location.href}`;

        return h('a', {
          class: ['no-need-close', `editable-${key}`],
          contenteditable: false,
          href
        }, value);
      })
    ])

    const isVNode = (target as any)._vnode?.__v_isVNode;
    render(isVNode ? null : vNode, target)
  }
  /**
   * remove menu
   */
  const removeMenu = () => {
    const editMenu = document.querySelector('.editable-menu');
    editMenu && editMenu.remove();
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
   *
   * Compatible Chrome + Firefox for Node.innerText
   */

  const normalizeNodeInner = (text: string) => {
    return text.replace(/\s+/g, ' ').trim();
  }
  /**
   * @param event
   * */
  const updatePR = () => {
    // const repoPrefix = themeData?.value.repo || '';
    const repoPrefix = themeData.repo || '';
    if (!repoPrefix || !repoPrefix.length) {
      console.warn('Warning: You have not set the repo url');
      return;
    }
    const node = document.querySelector('.focus-editable');
    const menuNode = document.querySelector('.editable-menu');
    // plain text 模式下，menuNode 不是node 的直接子级
    menuNode && menuNode.remove();

    // TODO
    if (!node) return

    const content = normalizeNodeInner((node as HTMLElement)?.innerText);

    const line = node.getAttribute('data-editable-line');
    const { owner, repo } = getOwnerRepo(repoPrefix);

    if (isPlainTextStatus) {
      onRemoveFocusEditable();
      postSinglePR(owner, repo, $page.remoteRelativePath, content, Number(line));
    } else {
      getOriginContent(owner, repo, $page.remoteRelativePath);
    }
  }
  /**
   * handler plain text PR
   */
  const postSinglePR: PostSingleData = (owner, repo, path, content, line) => {
    // bus.$emit('showLoading', true);
    // bus.$emit('onClose');
    emit('showLoading', true);
    emit('onClose');
    const { updateAPI } = $page.$editable || {};
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
        emit('onReceive', data, true);
        emit('showLoading', false);
      })
      .catch(() => {
        emit('showLoading', false);
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
  const reloadPage = () => {
    location.reload();
  }

  /**
   * is plain text，create children no is a async function.
   * @return {boolean}
   * thi
   */
  const isPlainText = (node: EventTarget): boolean => {
    if (!(node instanceof Element)) return false;
    if (!node?.children?.length || (node.children.length && node.children[0].classList.contains('editable-menu'))) {
      isPlainTextStatus.value = true;
      return true;
    } else {
      isPlainTextStatus.value = false;
      return false;
    }
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
    emit('showLoading', true);
    emit('onClose');
    const { getContentAPI } = $page.$editable || {};
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
        emit('showLoading', false);
        if (data.success) {
          emit('showReview', {
            status: true,
            owner,
            repo,
            path,
            content: data.data,
          });
        } else {
          emit('onReceive', data, true);
        }
      })
      .catch(() => {
        emit('showLoading', false);
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
};
