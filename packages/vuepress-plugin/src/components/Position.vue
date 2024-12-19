<!--
文件行数 定位
-->
<template>
  <div class="editable-lines">
    <span v-for="item in lines" :key="item">{{ item }}</span>
  </div>
</template>

<script>
export default {
  props: {
    lines: {
      type: Number,
    },
  },
};
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