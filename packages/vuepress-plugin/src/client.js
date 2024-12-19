import './style.css';
import bus from './eventBus';
import { fetchOps } from './fetchConfig';

export default {
  data() {
    return {
      preLine: null,
      preNode: null,
      preNodeContent: null,
      isPlainTextStatus: false,
    };
  },
  async mounted() {
    const targetNode = document.querySelector('body');
    let isEditable = null;
    const dblClick = (event) => {
      const currentLine = event.target.getAttribute('data-editable-line');
      if (currentLine || currentLine != null) {
        isEditable = event.target.getAttribute('contenteditable');
        let oAuth = 'Github OAuth';
        event.target.classList.add('focus-editable');
        if (!this.isOAuthStatus()) {
          this.createMenu(event, { oAuth });
        }
        if (this.isPlainText(event.target)) {
          event.target.classList.remove('no-edit');
          if (this.isOAuthStatus()) {
            this.createMenu(event, {
              apply: '应用',
              restore: '还原',
            });
            event.target.setAttribute('contenteditable', true);
            this.listenerInput(event);
          }
        } else {
          event.target.classList.add('no-edit');
          if (this.isOAuthStatus()) {
            this.createMenu(event, {
              update: '修改',
              restore: '还原',
            });
          }
        }

        this.preLine = currentLine;
        this.preNode = event.target;
        // temp handler 实际上这种处理方式欠妥
        this.preNodeContent = event.target.innerHTML.replace(/<strong(.+?)strong>/g, '');
      }
    };

    if (targetNode) {
      targetNode.removeEventListener('dblclick', dblClick);
      targetNode.addEventListener('dblclick', dblClick);
      targetNode.removeEventListener('click', this.outsideClick);
      targetNode.addEventListener('click', this.outsideClick);
    }
    this.saveAccessToken();
  },
  methods: {
    saveAccessToken() {
      const { accessToken, login } = this.$route.query;
      if (accessToken) {
        sessionStorage.githubOAuthAccessToken = accessToken;
        sessionStorage.githubLogin = login || '';
      }
    },
    /**
     * click outside
     */
    outsideClick(event) {
      const clickLine = event.target.getAttribute('data-editable-line');
      if (this.preLine && clickLine !== this.preLine && !event.target.classList.contains('no-need-close')) {
        this.preNode.removeAttribute('contenteditable');
        this.preNode.classList.remove('focus-editable');
        this.preNode.classList.remove('no-edit');
        this.removeMenu();
      }
      this.bindMenuEvent(event);
    },
    /**
		 * apply menu
		 * restore menu
		 * @param event
		 * @param btnWords { Object}
		 * {apply: "应用",
        restore: "还原", // redirect update
        update: "修改" // call console ui
        }
		 */
    createMenu(event, btnWords) {
      this.removeMenu();

      const parenNode = document.createElement('strong');
      parenNode.classList.add('editable-menu');
      parenNode.classList.add('no-need-close');
      parenNode.setAttribute('contenteditable', false);
      const vNode = document.createDocumentFragment();

      for (let key in btnWords) {
        let childNode = null;
        if (key !== 'oAuth') {
          childNode = document.createElement('span');
        } else {
          childNode = document.createElement('a');
          const { githubOAuthUrl, clientId, redirectAPI } = this.$page.$editable || {};
          childNode.href = `${githubOAuthUrl}?client_id=${clientId}&redirect_uri=${redirectAPI}?reference=${location.href}`;
        }
        childNode.innerHTML = btnWords[key];
        childNode.setAttribute('contenteditable', false);
        childNode.classList.add('no-need-close');
        childNode.classList.add('editable-' + key);
        vNode.appendChild(childNode);
      }
      parenNode.appendChild(vNode);
      event.target.appendChild(parenNode);
    },
    /**
     * remove menu
     */
    removeMenu() {
      const editMenu = document.querySelector('.editable-menu');
      editMenu && editMenu.remove();
    },

    bindMenuEvent(event) {
      if (event.target.classList.contains('editable-apply') || event.target.classList.contains('editable-update')) {
        this.updatePR(event);
      }
      if (event.target.classList.contains('editable-restore')) {
        this.reloadPage(event);
      }
    },

    /**
     * 
     * Compatible Chrome + Firefox for Node.innerText
    */

    normalizeNodeInner(text){
      return text.replace(/\s+/g,' ').trim();
    },
    /**
     * @param event
     * */
    updatePR(event) {
      const repoPrefix = this.$themeConfig.repo || '';
      if (!repoPrefix || !repoPrefix.length) {
        console.warn('Warning: You have not set the repo url');
        return;
      }
      const node = document.querySelector('.focus-editable');
      const menuNode = document.querySelector('.editable-menu');
      // plain text 模式下，menuNode 不是node 的直接子级
      menuNode && menuNode.remove();

      const content = this.normalizeNodeInner(node.innerText);

      const line = node.getAttribute('data-editable-line');
      const { owner, repo } = this.getOwnerRepo(repoPrefix);

      if (this.isPlainTextStatus) {
        this.onRemoveFocusEditable();
        this.postSinglePR(owner, repo, this.$page.remoteRelativePath, content, line);
      } else {
        this.getOriginContent(owner, repo, this.$page.remoteRelativePath);
      }
    },
    /**
     * handler plain text PR
     */
    postSinglePR(owner, repo, path, content, line) {
      bus.$emit('showLoading', true);
      bus.$emit('onClose');
      const { updateAPI } = this.$page.$editable || {};
      fetch(updateAPI, {
        body: JSON.stringify({
          owner,
          repo,
          path,
          content,
          line: Number(line),
        }),
        method: 'POST',
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
          bus.$emit('onReceive', data, true);
          bus.$emit('showLoading', false);
        })
        .catch(() => {
          bus.$emit('showLoading', false);
        });
    },
    /**
     * @return {
     *  owner,
     *  repo
     * }
     */
    getOwnerRepo(ownerRepo) {
      const strArr = ownerRepo.split('/');
      return {
        owner: strArr[0] ? strArr[0] : '',
        repo: strArr[1] ? strArr[1] : '',
      };
    },
    reloadPage() {
      location.reload();
    },

    /**
     * is plain text，create children no is a async function.
     * @return {boolean}
     * thi
     */
    isPlainText(node) {
      if (!node.children.length || (node.children.length && node.children[0].classList.contains('editable-menu'))) {
        this.isPlainTextStatus = true;
        return true;
      } else {
        this.isPlainTextStatus = false;
        return false;
      }
    },

    /**
     * listener contenteditable input
     * contenteditable 里的内容被清空的行为导致丢失 textElement
     * 此举为了不丢失 contenteditbale 特性而追加的
     * @fix 提交只时，移除字符
     */
    listenerInput(event) {
      event.target.addEventListener('input', (inputEvent) => {
        const firstTextNode = inputEvent.target.childNodes[0];
        if (firstTextNode.nodeName !== '#text') {
          console.log('firstTextNode=>', firstTextNode);
          const emptyTextNode = document.createDocumentFragment();
          const aNode = document.createTextNode('\u00A0');
          emptyTextNode.appendChild(aNode);
          inputEvent.target.insertBefore(emptyTextNode, firstTextNode);
        }
      });
    },
    /**
     * get origin source file content
     */
    getOriginContent(owner, repo, path) {
      bus.$emit('showLoading', true);
      bus.$emit('onClose');
      const { getContentAPI } = this.$page.$editable || {};
      // owner repo path
      fetch(getContentAPI + '?owner=' + owner + '&repo=' + repo + '&path=' + path, {
        method: 'GET',
        ...fetchOps,
        headers: new Headers({
          'Access-Token': sessionStorage.githubOAuthAccessToken,
          'Github-Login': sessionStorage.githubLogin,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          bus.$emit('showLoading', false);
          if (data.success) {
            bus.$emit('showReview', {
              status: true,
              owner,
              repo,
              path,
              content: data.data,
            });
          } else {
            bus.$emit('onReceive', data, true);
          }
        })
        .catch(() => {
          bus.$emit('showLoading', false);
        });
    },
    /*
     * 判断是否授权过，即检查本地是否存储 access token
     * @return  {boolean}
     */
    isOAuthStatus() {
      const accessToken = this.$route.query.accessToken;
      return !!(accessToken && accessToken.length === 40);
    },

    /**
     * remove focus class and contentEditable attribute
     *
     */
    onRemoveFocusEditable() {
      const focusNode = document.querySelector('.focus-editable');
      focusNode.removeAttribute('contenteditable');
      this.preNode.classList.remove('focus-editable');
    },
  },
};
