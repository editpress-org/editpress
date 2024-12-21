<!--
文件行数 定位
-->
<template>
  <div class="editable-lines">
    <span v-for="item in lines" :key="item">{{ item }}</span>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';

// 接收父组件传递的props
const props = defineProps({
  lines: {
    type: Number,
  },
});

// 使用toRefs解构props，方便后续在模板中使用且保持响应性
const { lines } = toRefs(props);
</script>

<style scoped>
.editable-lines {
  background-color: #fff;
  padding: 88px 0 0 15px;
}
.editable-lines > span {
  display: block;
  height: 18px;
}
</style>
