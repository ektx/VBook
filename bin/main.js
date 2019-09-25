const Bundler = require('parcel-bundler')
const path = require('path')
const app = require('express')()
const fs = require('fs')
const mime = require('mime')
const { getIPs } = require('./getIPs')
const homedir = require('os').homedir()

module.exports = async function ({appName, version, ...opts}) {
	const appPath = path.join(homedir, `.vbook/${appName}`)
	// 入口文件地址
	const entryFiles = path.join(appPath, 'contents/public/index.html')
	// 设置一个延迟启动服务功能
	let timer = null

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
		if (req.path.endsWith('.md')) {
			req.$file = req.path
			streamEvt(req, res)
		}
		else {
			next()
		}
	})

	app.use(bundler.middleware())

	bundler.on('buildStart', entryPoints => {
		// 清除延迟服务
		if (timer) clearTimeout(timer)
	})

	bundler.on('buildEnd', () => {
		// 防止服务多次构建，保证只在最后一次运行服务功能
		timer = setTimeout(() => {
			startServe(app, opts.port)
		}, 1000)
	})

}

/**
 * 文件浪服务
 * @param {req} req 
 * @param {res} res 
 */
function streamEvt (req, res) {
	let file = path.join(process.cwd(), req.$file)

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