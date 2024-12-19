# editpress

Simplified online editing solution for technical documentation with support for a variety of static site generator frameworks such as vuepress, vitepress,

## Documents

| repository & submodules            | domain                                                     | description                 |
| ---------------------------------- | ---------------------------------------------------------- | --------------------------- |
| [docs](/docs/)                     | [editpress.org](https://editpress.org)                     | editpress documentation     |
| [rspress-docs](/rspress-docs)      | [rspress.editpress.org](https://rspress.editpress.org)     | rspress-plugin playground   |
| [vuepress-docs](/vuepress-docs)    | [vuepress.editpress.org](https://vuepress.editpress.org)   | vuepress-plugin playground  |
| [vitepress-docs](/vietepress-docs) | [vitepress.editpress.org](https://vitepress.editpress.org) | vitepress-plugin playground |

## Features

| frameworks | process                | description | playground                           |
| ---------- | ---------------------- | ----------- | ------------------------------------ |
| vuepress   | 60%，reconstructing... |             | [vue 2.x](https://editable.veaba.me) |
| vitepress  | TODO                   |             |                                      |
| rspress    | TODO                   |             |                                      |

---

## dev

```tree
.
|-- docs                      —— submodule editpress-org/docs
|-- packages                  ——
|   |-- rspress-plugin        ——
|   |-- vitepress-plugin      ——
|   `-- vuepress-plugin       ——
|-- rspress-docs              —— submodule editpress-org/rspress-docs
|-- vitepress-docs            —— submodule editpress-org/vitepress-docs
`-- vuepress-docs             —— submodule editpress-org/vuepress-docs

```

dev docs:

```shell
git clone git@github.com:editpress-org/editpress.git
git submodule update --init
pnpm i
pnpm run docs:dev
```

### launch 4 docs

```shell
pnpm run docs:dev
```
