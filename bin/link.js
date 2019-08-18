const fs = require('fs')
const path = require('path')

console.log(process.cwd(), __dirname)

module.exports = function () {
  let dest = path.join(__dirname, '../src')
  fs.symlinkSync(
    path.join(process.cwd(), '../src'),
    dest
  )
  fs.chmodSync(dest, '755')
}