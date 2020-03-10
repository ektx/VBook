#! /usr/bin/env node

const program = require('commander')
const path = require('path')
const package = require('./package.json')
const run = require('./bin/main')
const link = require('./bin/link')
const build = require('./bin/build')
const generateDoc = require('./bin/generateDoc')
const version = package.version
const appPathArr = process.cwd().split(path.sep)
const appName = appPathArr[appPathArr.length -2]

program
  .version(version)

program
  .command('init')
  .description('设置项目链接')
  .action(() => {
    link(appName)
  })


program
  .command('doc')
  .description('选择 vue 文件生成 markdown 文件')
  .action(() => {
    generateDoc()
  })

program
  .command('run')
  .description('启动文档服务')
  .option('-p, --port [port]', '服务商品，默认 8888')
  .option('-s, --https', '使用HTTPS服务，默认为HTTP')
  .action(cmd => {
    // 重置端口
    let port = parseInt(cmd.port)

    if (cmd.port && !isNaN(port)) {
      cmd.port = port
    } else {
      cmd.port = 8888
    }

    run({...cmd, appName, version})
  })

program
  .command('build')
  .description('生成发布所需文档')
  .action(() => {
    build({appName})
  })

program.on('--help', function () {
  console.log(`
  Welcome Use VBook: ${version}

  Quick Start: vbook

  Use Option:\n
    > vbook -p 8888
  `)
})

program.parse(process.argv)
