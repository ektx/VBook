const Bundler = require('parcel-bundler')
const path = require('path')
const app = require('express')()
const fs = require('fs')
const mime = require('mime')
const { getIPs } = require('./getIPs')


module.exports = async function ({appName, version, ...opts}) {
	const docRoot = path.join(__dirname, `../.app/${appName}`)
	// 入口文件地址
	const entryFiles = path.join(docRoot, 'contents/public/index.html')

	const options = {
		outDir: path.join(docRoot, 'dist'),
		outFile: 'index.html',
		cacheDir: path.join(docRoot, 'cache'),
		// hmr: false,
		// target: 'node',
		// watch: false,
		// cache: false
		// publicUrl: './',
		// detailedReport: true
	}

	const bundler = new Bundler(entryFiles, options)

	app.get('*', function (req, res, next){
		console.log(req.path)
		if (req.path.endsWith('.md')) {
			req.$file = req.path
			streamEvt(req, res)
		}
		else {
			next()
		}
	})

	app.use(bundler.middleware())

	bundler.on('buildEnd', () => {
		app.listen(opts.port, async () => {
			let {IPv4} = await getIPs()
			console.log(`
Server Running at:

  - Local:   http://localhost:${opts.port}/
  - Network: http://${IPv4}:${opts.port}/

  * Ctrl + C : Stop the server, more infomation vist https://github.com/ektx/VBook
`)
		})
	})
}

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