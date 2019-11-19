const fs = require('fs-extra')
const path = require('path')
const Bundler = require('parcel-bundler')
const inquirer = require('inquirer')
const homedir = require('os').homedir()

module.exports = async function ({appName}) {
  let overwrite = false
  let {savePath, baseURL} = await inquirer.prompt([
    {
      type: 'input',
      name: 'savePath',
      message: '保存的目录',
      default: '../docs'
    },
    {
      type: 'input',
      name: 'baseURL',
      // 这里是用来调整你的 router 中 New Router中的 base
      message: '输入你需要调整的路由 base',
      default: ''
    }
  ])
  // 设置环境为生产环境
  process.env.NODE_ENV = 'production'

  // 获取文件的绝对地址
  if (!path.isAbsolute(savePath)) {
    savePath = path.join(process.cwd(), savePath)
  }

  // 判断文件夹是否已经存在，存在时提示用户是覆盖还是取消进程
  if (fs.existsSync(savePath)) {
    answer = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: '当前文件已经存在，是否覆盖',
      default: false
    }])

    overwrite = answer.overwrite
  }

  // 设置路由的 base 地址
  process.env.BASE_URL = baseURL

  if (overwrite) {
    await fs.emptyDir(savePath)

    buildEvt(savePath, appName)
  }

}

function buildEvt (outDir, appName) {
  const appPath = path.join(homedir, `.vbook/${appName}`)
	// 入口文件地址
  const entryFiles = path.join(appPath, 'contents/public/index.html')
  
  const opts = {
    outDir,
    outFile: 'index.html',
    cacheDir: path.join(appPath, 'cache'),
    minify: true,
    hmr: false
  }

  const bundler = new Bundler(entryFiles, opts)

  bundler.on('buildEnd', async () => {
    console.log(`🚚 移动 markdown 文件`)

    let files = fs.readdirSync(process.cwd())
    let copyPromise = []

    files.forEach(file => {
      if (file.endsWith('.md')) {
        let from = path.join(process.cwd(), file)
        let to = path.join(outDir, file)

        copyPromise.push(fs.copy(from, to))
      }
    })

    try {
      await Promise.all(copyPromise)
      console.log(`🌈 生成成功！`)
      process.exit()
    } catch (err) {
      console.log(`Err:`, err)
    }
  })

  bundler.bundle()
}
