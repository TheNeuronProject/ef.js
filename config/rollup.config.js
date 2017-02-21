// Rollup plugins
const babel = require('rollup-plugin-babel')
const eslint = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const progress = require('rollup-plugin-progress')
const json = require('rollup-plugin-json')
const git = require('git-rev-sync')
const { version } = require('../package.json')

module.exports = {
	moduleName: 'ef',
	entry: 'src/ef.js',
	devDest: 'test/ef.dev.js',
	proDest: 'dist/ef.min.js',
	format: 'iife',
	sourceMap: 'inline',
	plugins: [
		progress({
			clearLine: false
		}),
		eslint(),
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs(),
		json(),
		replace({
			ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
			VERSION: JSON.stringify(`${version}.${git.branch()}.${git.short()}`)
		}),
		babel({
			exclude: 'node_modules/**',
			runtimeHelpers: true
		}),
		(process.env.NODE_ENV === 'production' && uglify())
	]
}
