const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')

async function init() {
  let docLinst = []
  let { filePath } = await inquirer.prompt([{
    type: 'input',
    name: 'filePath',
    message: '请输入你的 vue 文件地址',
    default: '/Users/zhuwenlong/Sites/V5/VC/src/components/detailList/index.vue',
    validate(val) {
      val = val.trim()

      if (path.extname(val) !== '.vue') {
        return '文件不是vue文件'
      }

      if (!fs.existsSync(val)) {
        return '没有发现文件'
      }

      return true
    }
  }])

  filePath = filePath.trim()

  console.log(`📃`, filePath)

  let fileInner = await fs.readFile(filePath, 'utf8')
  let fileLines = fileInner.split(/\r|\n/)
  // 用于记录是否开启了props字段截取功能
  let propsStart = 0
  let propsString = ''
  // 临时注释内容
  let commentTem = {
    // 记录内容
    inner: '',
    // 记录起始信息
    // 当对字符串处理时，碰到 /** 加1; */ 减1
    step: 0,
    // line 单行注释 block 多行注释
    type: ''
  }

  for (let i = 0; i < fileLines.length; i++) {
    let lineStr = fileLines[i]
    
    lineStr = lineStr.trim()

    // 如果字段开始是props我们开始记录
    // 且propsStart为0时
    if (
      lineStr.startsWith('props') 
      && !propsStart
    ) {
      propsStart = 1
    }
    // 如果已经开启了props的记录时
    else if (propsStart) {
      // 每次发现 { 我们认为中 props 内的对象
      // 层级上升一级
      if (lineStr.includes('{')) {
        propsStart++
      } 
      // 每次发现 } 时，正好与上次的 { 匹配，此时层级回退一级
      if (lineStr.includes('}')) {
        propsStart--

        // 在回退到一级时，当step为-1时，为注释结束，
        // 此时我们将注释添加到当前的props中
        if (commentTem.step < 0 && propsStart === 1) {
          // 如果是行内注释
          if (commentTem.type === 'line') {
            propsString += `, description:' ${commentTem.inner}'`
          } else {
            // 如果字符串有单引号，默认转换成双引号
            propsString += `, description:' ${commentTem.inner.replace(/\'/g, '"')}'`
          }
          // 清空之前的数据
          commentTem.step = 0
          commentTem.inner = ''
        }
      }
      
      // 如果 propsStart 大于0;保存数据
      if (propsStart) {
        // 处理注释内容
        if (
          lineStr.startsWith('/*') ||
          lineStr.startsWith('*')
        ) {
          if (lineStr.startsWith('/*')) {
            commentTem = {
              inner: lineStr.replace(/^\/\*+/, ''),
              step: 1,
              type: 'block'
            }
          } 
          else if (lineStr.endsWith('*/')) {
            commentTem.step = -1
            commentTem.inner += lineStr.replace(/\*+\/$/, '')
          }
          else {
            commentTem.inner += lineStr
            commentTem.step++
          }
        } else if (lineStr.startsWith('//')) {
          commentTem = {
            inner: lineStr.slice(2).trim(),
            step: -1,
            type: 'line'
          }
        } else {
          propsString += lineStr
        }
        
      }

    }
  }

  let arr = str2data(propsString)
  console.log( generateMD({
    name: 'Props', 
    data: arr
  }))
}

init()

/**
 * 将对象字符串转换成对象
 * @param {string} str 对象字符串
 */
function str2data (str) {
  let props = Function(`return {${str}}`)()
  let result = []

  // 处理 props
  for (let key in props) {
    let {type, description, default: defaultVal} = props[key]

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

    result.push({
      label: key,
      type,
      description,
      default: defaultVal
    })
  }

  return result
}

/**
 * 生成 markdown 文档
 * @param {string} name 标题
 * @param {string} data vue props 内容
 * @param {number} level 级别
 */
function generateMD({name = '', data, level = 1}) {
  console.log(data)
  // 转换成 js 对象，并取值 props
  let mkObj = {
    // markdown文档标题
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

  // 文档内容
  let mkInner = ''
  // 标题内容
  let titleStr = ''
  // 对齐方式
  let alignStr = ''
  let children = ''

  // 生成标题与对齐方式
  for (let i = 0; i < mkObj.header.length; i++) {
    titleStr += ` ${mkObj.header[i].label} |`
    alignStr += ` --- |`
  }

  // 组装标题与对齐方式
  mkInner = `|${titleStr}\r\n|${alignStr}\r\n`

  // 生成文档
  for (let i = 0; i < data.length; i++) {
    let item = ''

    for (let j = 0; j < mkObj.header.length; j++) {
      let { key } = mkObj.header[j]
      let val = data[i][key] || ''

      switch (key) {
        case 'label':
          item += `| **${val}** `
          break
        case 'type':
          // 优化对多个属性展示效果
          if (Array.isArray(val)) {
            val = val.join('|')
          }
          item += `| \`${val}\` `
          break
        case 'default':
          // 只要不是字符串内容都转换成字符串
          if (typeof val !== 'string') {
            val = JSON.stringify(val)
          }
          item += `| ${val} `
          break
        case 'description':
          if (val.includes('@resolve')) {
            let [first, end] = val.split('@resolve')
            val = first
            val = val.replace(/\*/g, '')

            // 解析注释内容
            children = resolveString(data[i].label, end, level+1)
          } else {
            val = val.replace(/\*/g, '<br/>')
          }

          // 处理markdown中对|的安全处理 | => \|
          val = val.replace(/\|/g, '\\|')
          item += `| ${val.trim()} `
          break
        default:
          item += `|${val} `
      }
    }

    mkInner += `${item} |\r\n`
  }

  return `${'#'.repeat(level)} ${name} \r\n${mkInner}\r\n` + children
}

/**
 * 解析注释内容
 * @param {string} name 名称
 * @param {string} val 字符串内容
 * @param {number} level 字符串内容
 */
function resolveString (name, val, level) {
  let arr = val.split(/\*/)
  let result = []

  for (let i = 0; i < arr.length; i++) {
    // 处理类似 'label: {String}' 标题 的内容
    if (/{(.+)}/.test(arr[i])) {
      // 先取出类型
      let type = arr[i].match(/{.+?}/)[0]
      // 以取出的类型进行分隔
      let [label, description] = arr[i].split(type)
      
      result.push({
        label: label.trim().replace(/(\W+)$/, ''),
        type,
        description: description.trim()
      })
    }
  }

  return generateMD({
    name,
    level,
    data: result
  })
}