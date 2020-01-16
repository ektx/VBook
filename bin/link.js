const path = require('path')
const execa = require('execa')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const homedir = require('os').homedir()
const { hasYarn } = require('./env')

let indexInner = require('../doc/index')

module.exports = async function (name) {
  // 在用户目录下创建一个完整的项目库
  const docRoot = path.join(homedir, `.vbook/${name}`)

  let hasFile = fs.existsSync(docRoot)

  if (hasFile) {
    let { overwritten } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwritten',
      message: '此项目已经初始化，是否覆盖重置？',
      default: false
    }])
  
    if (overwritten) {
      console.log('🔥 正在清空原有项目')

      fs.emptyDirSync(docRoot)

      console.log('🌈 清理完成')
      
      init(name, docRoot)
    }
    
  } else {
    init(name, docRoot)
  }
}

/**
 * @param {string} name 项目文件名
 * @param {string} docRoot 组件项目地址
 */
async function init (name, docRoot) {
  // 提示用户是否使用淘宝镜像要安装依赖
  let { taobaoURL } = await inquirer.prompt([{
    type: 'confirm',
		name: 'taobaoURL',
    message: '使用淘宝镜像吗?',
    default: false
  }])

  let TAOBAO_NPM_URL = '--registry=https://registry.npm.taobao.org'
  let execaArgs = []

  // 如果确认使用 taobao 镜像时
  if (taobaoURL) {
    execaArgs.push(TAOBAO_NPM_URL)
  }

  // index.js 目录文件
  let indexPath = path.join(process.cwd(), 'index.js')
  let hasFile = fs.existsSync(indexPath)

  indexInner.title = name
  indexInner = `export default ${JSON.stringify(indexInner, '', '  ')}`

  if (!hasFile) {
    console.log('📝 生成目录文件！Create index.js...')
    
    fs.writeFileSync(indexPath, indexInner, {encoding: 'utf8'})
  } else {
    let { overwritten } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwritten',
      // 提示用户目录中已经有 index.js 控制文件，是否需要重置
      message: '目录文件已经存在，是否重置？',
      default: false
    }])
  
    if (overwritten) {
      console.log('📝 更新目录文件！ Update index.js...')

      fs.writeFileSync(indexPath, indexInner, {encoding: 'utf8'})
    }
  }
      
  // 创建引用文件
  let mainFrom = path.join(process.cwd(), './index.js')
  let mainLink = path.join(docRoot, './index.js')
  createLink(mainFrom, mainLink)

  console.log('⚙️  初始化中！Init Starting...')

  // 设置当前项目库
  fs.ensureDirSync(docRoot, 0o2775)
  // 创建组件库的符号链接
  let srcFrom = path.join(process.cwd(), '../src')
  let srcLink = path.join(docRoot, 'MY_COMPONENTS')
  createLink(srcFrom, srcLink)

  // 创建共用包的符号链接
  let modFrom = path.join(docRoot, './node_modules')
  fs.ensureDirSync(modFrom, 0o2775)
  let modLink = path.join(docRoot, './node_modules')
  createLink(modFrom, modLink)

  /** Public Path */ 
  let vbookPublic = path.join(__dirname, '../contents/public')
  let uiPublic = path.join(process.cwd(), '.vbook/public')
  let homePublic = path.join(docRoot, 'public')

  fs.copySync(vbookPublic, homePublic)
  createLink(homePublic, uiPublic)

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
  
  // 创建渲染层的模板引用
  // 独立的 src 目录可以方便用户自己配置或修改渲染页面效果
  // 同时不会影响到其它的项目工程
  fs.copySync(
    path.join(__dirname, '../contents/src'),
    path.join(docRoot, 'src')
  )
  
  // 安装包依赖
  console.log('🚚 处理相关依赖...')
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
    console.log('🎉 创建完成！\n👉 Go on with: vbook run\n\n')
  })
}

/**
 * 创建文件软链接
 * @param {string} from 目标地址
 * @param {string} to 链接地址
 */
function createLink(from, to) {
  fs.ensureSymlinkSync(from, to)
  fs.chmodSync(to, '755')
}
