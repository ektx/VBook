const path = require('path')

module.exports = {
    runtimeCompiler: true,
    devServer: {
        contentBase: [
            path.join(__dirname, 'public'),
            path.join(__dirname, 'doc')
        ]
    }
}