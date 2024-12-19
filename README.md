# editpress

Quickly edit technical documents

## Documents

- [editpress.org](https://editpress.org)
- [rspress docs](https://rspress.editpress.org)
- [vuepress docs](https://vuepress.editpress.org)
- [vitepress docs](https://vite.editpress.org)

## Features

| frameworks | process                | description | playground                           |
| ---------- | ---------------------- | ----------- | ------------------------------------ |
| vuepress   | 60%，reconstructing... |             | [vue 2.x](https://editable.veaba.me) |
| vitepress  | TODO                   |             |                                      |
| rspress    | TODO                   |             |                                      |

---

一个主 docs，介绍多个站点。rspress 来维护。

其次，再创建子框架站点。

vuepress.editpress.org 仓库 1
vitepress.editpress.org 仓库 2
rspress.editpress.org 仓库 2
editprss.org 仓库 4
可能用得上的仓库，用于后续可能的商业化或者收费。
vip.editpress.org 仓库 5

monorepo 使用脚本强推到指定仓库去。

决定还是，新开主仓库，使用脚本来维护子仓库 main 分支？
editpress
或者说，借助 submodule 实现。
不知道可不可以用 workspace ～

## dev

### launch 3 docs

```shell
pnpm run docs:dev
```
