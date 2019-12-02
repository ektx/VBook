const fs = require('fs')
const path = require('path')

module.exports = function (pathLike) {
  let files = fs.readdirSync(pathLike)

  return files.map(file => fileStat(file, pathLike))
}

function fileStat (name, pathLike) {
  let _path = path.join(pathLike, name)
  let stat = fs.statSync(_path)

  return {
    name,
    path: _path,
    isDir: stat.isDirectory(),
    size: stat.size,
  }
}