const Bundler = require('parcel-bundler')
const path = require('path')
const app = require('express')()
const fs = require('fs')
const mime = require('mime')

// 入口文件地址
const entryFiles = path.join(__dirname, '../contents/public/index.html')

const options = {
	outDir: path.join(__dirname, '../dist'),
	outFile: 'index.html',
	// watch: false,
	// cache: false
	// publicUrl: './',
	// detailedReport: true
}

console.log(process.cwd(), __dirname)

module.exports = async function (opts, version) {
	const bundler = new Bundler(entryFiles, options);

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

	app.listen(opts.port)
}

function streamEvt (req, res) {
	let file = path.join(process.cwd(), req.$file)
	console.log(file)

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