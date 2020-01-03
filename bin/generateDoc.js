const path = require('path')
const inquirer = require('inquirer')
const vue2md = require('./vue2md')
const getFileTree = require('./getFileTree')

inquirer.registerPrompt('file-tree-selection', getFileTree)

module.exports = function () {
  inquirer
    .prompt([
      {
        type: 'file-tree-selection',
        name: 'file',
        message: '选择你要使用的 vue 文件',
        validate (val) {
          if (path.extname(val) !== '.vue') {
            return '文件不是vue文件'
          }
  
          return true
        }
      }
    ]).then(answers => {
      vue2md(answers.file)
    })
}