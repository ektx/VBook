#! /usr/bin/env node

const program = require('commander')
const path = require('path')
const package = require('./package.json')
const main = require('./bin/main')
const link = require('./bin/link')
const version = package.version
const appPathArr = process.cwd().split(path.sep)
const appName = appPathArr[appPathArr.length -2]

program
  .version(version)

program
  .command('init')
  .description('set vbook link')
  .action(() => {
    link(appName)
  })

program
  .command('run')
  .description('start the service')
  .option('-p, --port [port]', 'serve port, default: 8888')
  .option('-s, --https', 'use HTTPS, default HTTP')
  .action(cmd => {
    // 重置端口
    let port = parseInt(cmd.port)

    if (cmd.port && !isNaN(port)) {
      cmd.port = port
    } else {
      cmd.port = 8888
    }

    main({...cmd, appName, version})
  })

program.on('--help', function () {
  console.log(`
  Welcome Use VBook: ${version}

  Quick Start: vbook

  Use Option:
  > vbook -p 8888
  `)
})

program.parse(process.argv)
