const fs = require('fs-extra')
const path = require('path')

/**
 * @param {string} name 项目文件名
 */
module.exports = function (name) {
  const docRoot = path.join(__dirname, `../.app/${name}`)

  // 设置doc在的缓冲目录
  fs.ensureDirSync(docRoot, 0o2775)
  // 创建组件库的符号链接
  let srcFrom = path.join(process.cwd(), '../src')
  let srcLink = path.join(docRoot, 'src')
  createLink(srcFrom, srcLink)
  // 创建共用包的符号链接
  let modFrom = path.join(__dirname, '../node_modules')
  let modLink = path.join(docRoot, 'node_modules')
  createLink(modFrom, modLink)
  // 创建渲染层的模板引用
  let contents = path.join(__dirname, '../contents')
  let contentsLink = path.join(docRoot, 'contents')
  createLink(contents, contentsLink)
  // 创建独立的包管理文件
  fs.copySync(
    path.join(__dirname, '../package.json'),
    path.join(docRoot, 'package.json')
  )
  console.log('创建完成')
}

function createLink(from, to) {
  fs.ensureSymlinkSync(from, to)
  fs.chmodSync(to, '755')
}