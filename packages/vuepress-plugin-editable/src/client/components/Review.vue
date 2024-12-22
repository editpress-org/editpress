<template>
  <div
    v-if="eventData.status"
    class="editable-review"
    :style="{
      'z-index': eventData.status? 2 : -1
    }"
  >
    <div class="editable-review-warp">
      <Position :lines="breakLines"></Position>
      <!-- TODO: Get English version content-->
      <div class="editable-review-code">
        <div class="editable-new-code editable-review-body">
          <p>
            Powered by
            <a
              href="https://github.com/editpress-org/editpress/"
              target="_blank"
            >
              vuepress-plugin-editable
            </a>
            and
            <a href="https://github.com/veaba/veaba-bot/" target="_blank">
              veaba-bot
            </a>
          </p>
          <!-- `<pre>` elements and content are not on the same line, there will be indentation problems.-->
          <pre
            class="editable-new-content"
            contenteditable="true"
            @input="onChange"
            >{{ eventData.content }}</pre
          >
          <!-- btn -->
          <div class="editable-review-btn">
            <button @click="onApplyPullRequest" :disabled="disabled">
              应用(Apply)
            </button>
            <button @click="closeModal">关闭(Close)</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
// import bus from '../eventBus';
import { fetchOps } from '../../shared/config.js';
import Position from './Position.vue';

// 定义响应式数据
const eventData = ref({
  content: '',
  status: false
});
const disabled = ref(false);
const originContentLine = ref(0);
const otherDivLine = ref(0);
const bodyScrollDefaultValue = ref('');

// 计算属性 breakLines
const breakLines = computed(() => originContentLine.value + otherDivLine.value);

// 挂载时的逻辑
onMounted(() => {
  originContentLine.value = countOriginContent(eventData.value.content);
  // bus.$on('showReview', (data) => {
  //   eventData.value = data;
  //   originContentLine.value = countOriginContent(data.content);
  //   bodyScrollDefaultValue.value = switchBodyScroll();
  // });
});

// 定义关闭模态框的方法
const closeModal = () => {
  location.reload();
};

// 防抖函数
const debounce = (fn, wait) => {
  let timer = 0;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(null, args);
    }, wait);
  };
};

// 切换页面滚动的方法
const switchBodyScroll = (isReset) => {
  const body = document.querySelector('body');
  const tempOverflowValue = body.style.overflow;
  if (isReset) {
    body.style.overflow = bodyScrollDefaultValue.value;
    nextTick(() => {
      bodyScrollDefaultValue.value = '';
    });
  } else {
    body.style.overflow = 'hidden';
  }
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
    for (let i in text) {
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
  const content = contentNode && contentNode.innerText;
  // bus.$emit('showLoading', true);
  const { updateAPI } = window.$page.$editable || {};
  fetch(updateAPI, {
    body: JSON.stringify({
      owner: eventData.value.owner,
      repo: eventData.value.repo,
      path: eventData.value.path,
      content: content
    }),
    method: 'POST',
   ...fetchOps,
    headers: new Headers({
      'Access-Token': sessionStorage.githubOAuthAccessToken,
      'Github-Login': sessionStorage.githubLogin,
      'Content-Type': 'Application/json'
    })
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

</script>

<style lang="stylus" scoped>
.editable-review {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style>