const Bundler = require('parcel-bundler')
const path = require('path')
const app = require('express')()
const fs = require('fs')
const mime = require('mime')



module.exports = async function ({appName, version, ...opts}) {
	const docRoot = path.join(__dirname, `../.app/${appName}`)
	// 入口文件地址
	const entryFiles = path.join(docRoot, 'contents/public/index.html')

	const options = {
		outDir: path.join(docRoot, 'dist'),
		outFile: 'index.html',
		cacheDir: path.join(docRoot, 'cache'),
		hmr: false,
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
	.get('/vbook/index', function(req, res) {
		req.$file = 'index.js'
		streamEvt(req, res)
	})

	app.use(bundler.middleware())

	app.listen(opts.port, () => {
console.log(`Server on http://localhost:${opts.port}`)
	})
}

function streamEvt (req, res) {
	let file = path.join(process.cwd(), req.$file)

	fs.access(file, err => {
		if (err) {
			res.send('file not exist')
			return
		}

		let stream = fs.createReadStream(file, {encoding: 'utf8'})
		
		// res.writeHead(200)
		res.setHeader('Content-Type', mime.getType(file))
		stream.pipe(res)
	})
}