const path = require('path')
const execa = require('execa')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const homedir = require('os').homedir()
const {hasYarn} = require('./env')

/**
 * @param {string} name 项目文件名
 */
module.exports = async function (name) {
  // 提示用户是否使用淘宝镜像要安装依赖
  let { taobaoURL } = await inquirer.prompt([{
    type: 'confirm',
		name: 'taobaoURL',
    message: 'Use Taobao Registry URL?',
    default: false
  }])

  let TAOBAO_NPM_URL = '--registry=https://registry.npm.taobao.org'
  let execaArgs = []

  // 如果确认使用 taobao 镜像时
  if (taobaoURL) {
    execaArgs.push(TAOBAO_NPM_URL)
  }

  console.log('⚙️  初始化中！Init Starting...')

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
  let modFrom = path.join(docRoot, '../node_modules')
  fs.ensureDirSync(modFrom, 0o2775)
  let modLink = path.join(docRoot, './node_modules')
  createLink(modFrom, modLink)

  // 创建渲染层的模板引用
  let contents = path.join(__dirname, '../contents')
  let contentsLink = path.join(docRoot, 'contents')
  createLink(contents, contentsLink)

  // 创建引用文件
  let mainFrom = path.join(process.cwd(), './index.js')
  let mainLink = path.join(docRoot, './index.js')
  createLink(mainFrom, mainLink)
  
  let postcssFrom = path.join(__dirname, '../postcss.config.js')
  let postcssLink = path.join(docRoot, './postcss.config.js')
  createLink(postcssFrom, postcssLink)

  let browserListFrom = path.join(__dirname, '../.browserslistrc')
  let browserListLink = path.join(docRoot, './.browserslistrc')
  createLink(browserListFrom, browserListLink)

  // 创建独立的包管理文件
  fs.copySync(
    path.join(__dirname, '../package.json'),
    path.join(docRoot, 'package.json')
  )
  
  // 安装包依赖
  let bin
  if (hasYarn()) {
    bin = 'yarn'
  } else {
    bin = 'npm'
    execaArgs = ['install', ...execaArgs]
  }

  let child = execa(bin, execaArgs, {cwd: docRoot, stdio: 'pipe'})

  child.stdout.on('data', buf => {
    process.stdout.write(buf)
  })

  child.stderr.on('data', buf => {
    process.stderr.write(buf)
  })

  child.on('close', () => {
    console.log('🎉 创建完成！Init Done!\n👉 Go on with: vbook run')
  })
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