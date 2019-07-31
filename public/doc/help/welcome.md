# VBook

[toc]

欢迎你使用 VBook 。 VBook 希望可以帮助你高效的书写 Vue 组件库文档。

## 特性

- markdown 文档的基础展示功能
- 可以在 markdown 文档中书写 Vue 组件示例功能

## 使用

```bash
# 克隆项目
git clone https://github.com/ektx/VBook.git

# 修改项目名称
mv VBook your_project

# 开发
cd your_project

# 安装依赖
yarn
# or 
npm i

# 运行服务
yarn serve
# or 
npm run serve
```

## 添加文档

**项目结构：**

```
 your_project
  ├─- public   静态资源
  |  ├─- doc   md 文档存放位置
  |  ├─- ...   其它文件
  |
  ├─- src      项目文档，如果需要定置，修改此处
  |  ├─- navs.js  菜单列表配制文件
  |  ├─- ...      其它文件
```

> 我们可以把文档写在 doc 的目录中，通过 navs.js 来管理结构与引用。

::: warning
其它文件用户不用操作，如需要定置化时，可自行修改。
:::

### markdown 规则

> 查看 markdown 规则菜单

### navs.js 规则

```js
export default [
    {
        label: '这是标题',
        // 这是下级，与 file 只能保持一个
        children: [
            {
                label: '标题',
                // file： markdown 在 doc 中的位置
                file: 'help/welcome'
            }
            // 更多内容
        ]
    },
    // 添加更多内容
]
```