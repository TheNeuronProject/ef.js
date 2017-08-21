// Rollup plugins
const buble = require('rollup-plugin-buble')
const eslint = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const progress = require('rollup-plugin-progress')
const json = require('rollup-plugin-json')

// Log build environment
switch (process.env.BUILD_ENV) {
	case 'DEV': {
		console.log(`
+---------------+
| DEVELOP BUILD |
+---------------+
`)
		break
	}
	case 'CI': {
		console.log(`
+----------+
| CI BUILD |
+----------+
`)
		break
	}
	default: {
		console.log(`
+--------------+
| NORMAL BUILD |
+--------------+
`)
	}
}

module.exports = {
	moduleName: 'ef',
	entry: 'src/ef.js',
	devDest: 'test/ef.dev.js',
	proDest: 'dist/ef.min.js',
	format: 'umd',
	sourceMap: true,
	plugins: [
		progress({
			clearLine: false
		}),
		eslint({
			exclude: ['*.json', '**/*.json']
		}),
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs(),
		json(),
		replace({
			ENV: JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		buble({
			transforms: {
				modules: false,
				dangerousForOf: true
			},
			objedtAssign: 'Object.assign'
		}),
		(process.env.NODE_ENV === 'production' && uglify())
	]
}
