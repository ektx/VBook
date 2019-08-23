# VBook

make demo easy!

欢迎你使用 VBook 。 VBook 希望可以帮助你高效的书写 Vue 组件库文档。

## 特性

- 简单易用。markdown 语法支持与扩展，让你可以写出更好更快的文档与效果。
- 快速搭建自己的 Vue 组件或示例的文档。
- 灵活的定制化，可以自己调整风格与主题。

## 安装

```bash
yarn global add @ektx/v-book
# or
npm i -g @ektx/v-book
```

## 使用

```bash
# 进入你需要展示的目录
cd doc

# 初始化目录
vbook init

# 运行
vbook run
```

## 基础约定

### 项目结构

```
 your_project
  ├─- doc      文档存放地址
  |  ├─- readme.md markdown文档，这里只列一个
  |  ├─- index.js  vbook 展示控制文件
  ├─- src      项目文档，如果需要定置，修改此处
  |  ├─- index.js  组件库主入口
  |  ├─- styles    组件库样式文件夹
  |     ├─- index.less 样式文件主入口，支持index.sass
```

> 目前暂不支持修改主件库的位置及组件库样式的引用位置。


### index.js 规则

```js
export default {
  // 页面标题
  title: 'VBook',
  // logo地址
  logo: '',
  // 侧边菜单内容列表
  aside: [
    {
      label: '使用指南',
      // doc 中的文件位置
      file: 'readme',
      children: [
        {
          label: '使用指南',
          file: 'readme'
        }
      ]
    },
  ]
}
```