#! /usr/bin/env node

const program = require('commander')
const package = require('./package.json')
const main = require('./bin/main')
const link = require('./bin/link')
const version = package.version

program
  .version(version)
  .option('-p, --port [port]', 'serve port, default: 8888')
  .option('-s, --https', 'use HTTPS, default HTTP')
  .option('-l, --link', 'use HTTPS, default HTTP')

program.on('--help', function () {
  console.log(`
  Welcome Use VBook: ${version}

  Quick Start: vbook

  Use Option:
  > vbook -p 8888
  `)
})

program.parse(process.argv)

// 重置端口
let port = parseInt(program.port)

if (program.port && !isNaN(port)) {
  program.port = port
} else {
  program.port = 8888
}
console.log(11, program.link)
if (program.link) {
  link()
} else {
  main({
    ...program,
    version
  })
}