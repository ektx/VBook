let value = `{
  name: 'vc-detail-list',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    /**
     * [{
     *    label: String,
     *    key: String,
     *    display: [block|inherit]
     *      - block 单行
     *      - inherit 默认
     *    mark: {
     *      width: String => {'100px'},
     *      inner: String
     *    }
     *    fun: Function (data, item) {
     *       return String
     *    },
     *    prefix: String
     *    suffix: String,
     *    hide: boolean 隐藏与显示
     *    slot: string 插槽
     * }]
     */
    format: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: ''
    },
    // 分隔符 
    separator: {
      type: String,
      default: ''
    },
    // 标题位置，参考 text-align
    labelAlign: {
      type: String,
      default: 'left'
    },
    column: {
      type: [String, Number],
      default: 1
    }
  }
}`

// 转换成 js 对象，并取值 props
let { props } = Function (`return ${value}`)()
let markdown = ''
let mkObj = {
  header: [
    {
      label: '参数',
      key: 'label'
    },
    {
      label: '类型',
      key: 'type'
    },
    {
      label: '说明',
      key: 'description'
    },
    {
      label: '默认值',
      key: 'default'
    },
    {
      label: '可选值',
      key: 'optionalValue'
    },
  ],
  data: []
}

// 处理 props
for (let key in props) {
  let item = props[key]
  let type = item.type
  let defaultVal = item.default

  // 取类型
  if (Array.isArray(type)) {
    type = type.map(t => {
      return t.name
    })
  } else {
    type = type.name
  }

  // 取默认值
  if (typeof defaultVal === 'function') {
    defaultVal = defaultVal()
  }

  mkObj.data.push({
    label: key,
    type,
    default: defaultVal
  })
}

let mkInner = ''
let titleStr = ''
let alignStr = ''

// 生成标题与对齐方式
for (let i = 0; i < mkObj.header.length; i++) {
  titleStr += ` ${mkObj.header[i].label} |`
  alignStr += ` --- |`
}

mkInner = `|${titleStr}\r\n|${alignStr}\r\n` 

// 生成文档
for (let i = 0; i < mkObj.data.length; i++) {
  let item = ''

  for (let j = 0; j < mkObj.header.length; j++) {
    switch (mkObj.header[j].key) {
      case 'label':
        item += `| *${mkObj.data[i].label}* `
        break
      case 'type':
        item += `| \`${mkObj.data[i].type}\` `
        break
      case 'default':
        item += `| ${JSON.stringify(mkObj.data[i].default)} `
        break
      default:
        item += `|  `
    }
  }

  mkInner += `${item} |\r\n`
}

console.log(mkInner)