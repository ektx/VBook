const Bundler = require('parcel-bundler')
const path = require('path')
const app = require('express')()
const bodyParser = require('body-parser')
const fs = require('fs')
const mime = require('mime')
const { getIPs } = require('./getIPs')
const homedir = require('os').homedir()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/**
 * @param {string} appName 组件库名称
 * @param {object} opts 配制信息
 */
module.exports = async function ({appName, ...opts}) {
  const appPath = path.join(homedir, `.vbook/${appName}`)
  // 入口文件地址
  const entryFiles = path.join(appPath, 'public/index.html')

  updateBridge(appPath)

  let servered = false
  const options = {
    outDir: path.join(appPath, 'dist'),
    outFile: 'index.html',
    cacheDir: path.join(appPath, 'cache'),
    // hmr: false,
    // target: 'node',
    // watch: false,
    // cache: false
    // publicUrl: './',
    // detailedReport: true
  }

  const bundler = new Bundler(entryFiles, options)

  app.get('*', function (req, res, next){
    next()
  })
  app.post('/api/getFile', streamEvt)

  app.use(bundler.middleware())

  bundler.on('bundled', () => {
    if (servered) return

    servered = true
    startServe(app, opts.port)
  })
}

/**
 * 文件流服务
 * @param {req} req 
 * @param {res} res 
 */
function streamEvt (req, res) {
  let file = ''
  let filePath = req.body.path

  // 使以 $$ 开头请求的文件，从服务器的目录中查寻
  // eg: $$/help/welcome.md => ../doc/help/welcome.md
  if (req.body.path.includes('$$/')) {
    file = path.join(__dirname, '../doc', filePath.replace('$$/', ''))
  } 
  // 其它的文件都从用户的目录中查寻
  else {
    file = path.join(process.cwd(), filePath)
  }
  console.log('🔍', path.basename(file), file)

  // 从用户自己的目录查找文件
  fs.access(file, err => {
    if (err) {
      res.send(`:::error\n文件并不存在! ${file} \n:::`)
      return
    }

    let stream = fs.createReadStream(file, {encoding: 'utf8'})
    
    res.setHeader('Content-Type', mime.getType(file))
    stream.pipe(res)
  })
}

/**
 * 启动 express 服务
 * @param {Express.app} app 
 * @param {Number} port 端口
 */
function startServe (app, port) {
  app.listen(port, async () => {
    let {IPv4} = await getIPs()

    console.log(`
Server Running at:

- Local:   http://localhost:${port}/
- Network: http://${IPv4}:${port}/

* Ctrl + C : Stop the server, more infomation vist https://github.com/ektx/VBook
`)
  })
}

/**
 * 更新用户扩展引用
 * @param {string} address 组件库地址
 */
function updateBridge (address) {
  let enhanceFile = path.join(address, 'enhance.js')
  let warnInfo = '// ⚠️ 请不要修改此文件'
  let noEnhance = `export default () => {}`
  let hasEnhance = `
import enhance from '../enhance.js'

export default ({Vue}) => {
  enhance(Vue)
}`

  if (fs.existsSync(enhanceFile)) {
    warnInfo += hasEnhance
  } else {
    warnInfo += noEnhance
  }

  fs.writeFileSync(
    path.join(address, 'src/bridge.js'),
    warnInfo, 
    {encoding: 'utf8'}
  )
}