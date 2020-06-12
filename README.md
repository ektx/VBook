# VBook

[TOC]

Make Vue Demo Easy!!

欢迎你使用 VBook。  
VBook 希望可以帮助你高效的书写 Vue 组件库文档。

## 特性

- 简单易用。
- 快速搭建自己的 Vue 组件或示例的文档。
- 灵活的定制化，可以自己调整风格与主题。

## 安装

```bash
npm i -g @ektx/v-book
```

## 使用

```bash
# 进入你需要展示的 markdown 目录
cd doc

# 初始化目录
vbook init

# 运行
vbook run

# 帮助
vbook -h
```

## 基础约定

### 项目结构

```
 Project
  ├─── doc （示例）markdown示例文档目录
  │  ├─── readme.md （可选）markdown文档，这里只列一个
  │  ├─── index.js  （必须 自动）vbook 展示控制文件
  |  ├─── .vbook    （必须 自动）功能扩展目录
  |     ├─── enhance.js  (可选)自定义组件库引用与第三方组件库扩展
  ├─── src          （示例）组件库位置，可以自定义位置
  │  ├─── index.js  （示例）组件库主入口
  │  ├─── styles    （示例）组件库样式文件夹
  │     ├─── index.less （示例）样式文件主入口，支持index.sass
```

说明：  
- **示例**：例子，用户可以自定义文件（夹）位置与名称
- **可选**：非必须文件，用户可以删除或自己创建类似文件
- **必须**：vbook运行必须文件，不可删除
- **自动**：vbook运行或初始化会自动生成


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
      children: [
        {
          label: '使用指南',
          // doc/readme.md
          file: 'readme'
        }
      ]
    },
  ]
}
```

### enhance.js

`enhance.js` 用于添加自己的组件库或引用第三方组件（库）。

```js
// root/index => Project/src/index.js
import VC from 'root/index';
import ElementUI from 'element-ui';

import 'root/styles/index.less'
import 'element-ui/lib/theme-chalk/index.css';

export default (Vue) => {
  Vue.use(VC)
  Vue.use(ElementUI)
}
```

> **root** 为 **Project/src** 目录



## 🚧 文档自动化

> 此功能处于开发测试中

### 操作

`vbook doc` 功能可以将当前工作目录以列表的方式列出，具体操作如下：

- **上下键** 来选择文件
- **Tab键** 进入文件夹
- **Enter** 来确认选择的 vue 文件
  
最终，终端会以 markdown 格式输出生成后的文档内容。

`ctrl + C` 退出生成功能。

### vue文件格式

对Props进行注释：

```js
export default {
  props: {
    // 我是单行注释
    name: {
      type: String,
      default: ''
    }
  }
}
```

输出：

```
# Props

| 参数 | 类型 | 说明 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| **name** | `String` | 我是单行注释 |  |  |
```

## 兼容性

| Chrome | Firefox |  IE   | Edge  | Safari |
| :---:  | :-----: | :---: | :---: | :----: |
|  49+   |   31+   |   -   |  16+  |  9.1+  |

[CSS Variables](https://caniuse.com/#search=css%20var)  