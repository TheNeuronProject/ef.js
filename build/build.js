console.log('Build starting...')

require('shelljs/global')
env.NODE_ENV = 'production'

const rollup = require('rollup').rollup
const {
	moduleName,
	entry,
	proDest: dest,
	format,
	plugins
} = require('../config/rollup.config')

console.log('Building...')

rollup({
	entry,
	plugins
})
.then((bundle) => {
	console.log('Writing bundle...')
	bundle.write({ dest, moduleName, format })
})
.then(() => console.log('Build successful!'))
