// Rollup plugins
const buble = require('rollup-plugin-buble')
const eslint = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const progress = require('rollup-plugin-progress')
const json = require('rollup-plugin-json')
const git = require('git-rev-sync')

module.exports = {
	moduleName: 'ef',
	entry: 'src/ef.js',
	devDest: 'test/ef.dev.js',
	proDest: 'dist/ef.min.js',
	format: 'umd',
	sourceMap: 'inline',
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
			ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
			GITVERSION: JSON.stringify(`${git.branch()}.${git.short()}`)
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
