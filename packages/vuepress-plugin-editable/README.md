# vuepress-plugin

Use with root directory

## TODO list

### client

- shiki
- markdown-it

### server

- API
  - 拉取 single file， no auth
    - 纯拉取: https://raw.githubusercontent.com/editpress-org/vuepress-docs/refs/heads/main/docs/get-started.md

### TODO 白名单

```json
{
  "code": 0,
  "success": false,
  "data": {},
  "message": "受域名白名单限制，请联系 @veaba 添加跨域白名单：https://github.com/veaba/vuepress-plugin-editable/issues"
}
```

## 如何使用

### 具体的 markdown 中页面添加 layout

- 关联 layout，绑定插件布局，待优化。这要求用户手动写太多。

目前为了实现，暂且手动

```md
---
layout: EditpressLayout
---
```

### ref 驱动 dom 改动方案

- https://cn.vuejs.org/guide/extras/reactivity-in-depth.html

### RxJS

RxJS 是一个用于处理异步事件流的库。VueUse 库提供了 @vueuse/rxjs 扩展来支持连接 RxJS 流与 Vue 的响应性系统。

- https://rxjs.dev/guide/overview
