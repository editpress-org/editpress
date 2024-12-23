export default {

// 假设 BtnWords 类型定义已正确引入
interface BtnWords {
  [key: string]: string;
}

// 假设 ExtendPages 和 $page 类型定义已正确引入
interface ExtendPages {
  // 相关属性定义
}

const $page = ref({
  $editable: {
    // 示例数据
    githubOAuthUrl: 'https://example.com/oauth',
    clientId: '12345',
    redirectAPI: 'https://example.com/redirect'
  }
});

const btnWords: BtnWords = {
  bold: '加粗',
  italic: '倾斜',
  // 其他按钮文本
};

const removeMenu = () => {
  // 移除菜单的逻辑
  const existingMenu = document.querySelector('.editable-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
};

const createMenu = (event: Event, btnWords: BtnWords) => {
  removeMenu();
  const target = event.target;
  if (!(target instanceof Element)) return;

  const $editable: ExtendPages = $page.value?.$editable;

  const vNode = h('strong', {
    class: ['editable-menu', 'no-need-close'],
    contenteditable: false
  }, [
    Object.entries(btnWords).map(([key, value]) => {
      let childNode;
      if (key!== 'oAuth') {
        childNode = h('span', {
          class: ['no-need-close', `editable-${key}`],
          contenteditable: false
        }, value);
      } else {
        const { githubOAuthUrl, clientId, redirectAPI } = $editable || {};
        const href = `${githubOAuthUrl}?client_id=${clientId}&redirect_uri=${redirectAPI}?reference=${window.location.href}`;
        childNode = h('a', {
          class: ['no-need-close', `editable-${key}`],
          contenteditable: false,
          href: href
        }, value);
      }
      return childNode;
    })
  ]);

  target.appendChild(vNode);
};

