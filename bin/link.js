const fs = require('fs-extra')
const path = require('path')
const homedir = require('os').homedir()

/**
 * @param {string} name 项目文件名
 */
module.exports = function (name) {
  // 在用户目录下创建一个完整的项目库
  const docRoot = path.join(homedir, `.vbook/${name}`)

  // 设置当前项目库
  fs.ensureDirSync(docRoot, 0o2775)
  // 创建组件库的符号链接
  let srcFrom = path.join(process.cwd(), '../src')
  let srcLink = path.join(docRoot, 'src')
  createLink(srcFrom, srcLink)

  // 创建共用包的符号链接
  // TODO: 移入用户目录下的 .vbook 中
  let modFrom = path.join(__dirname, '../node_modules')
  let modLink = path.join(docRoot, 'node_modules')
  createLink(modFrom, modLink)

  // 创建渲染层的模板引用
  let contents = path.join(__dirname, '../contents')
  let contentsLink = path.join(docRoot, 'contents')
  createLink(contents, contentsLink)

  let mainFrom = path.join(process.cwd(), './index.js')
  let mainLink = path.join(docRoot, './index.js')
  createLink(mainFrom, mainLink)

  // 创建独立的包管理文件
  fs.copySync(
    path.join(__dirname, '../package.json'),
    path.join(docRoot, 'package.json')
  )
  console.log('🎉 创建完成！Init Done!')
}

/**
 * 
 * @param {string} from 目标地址
 * @param {string} to 链接地址
 */
function createLink(from, to) {
  fs.ensureSymlinkSync(from, to)
  fs.chmodSync(to, '755')
}