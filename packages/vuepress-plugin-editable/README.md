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
