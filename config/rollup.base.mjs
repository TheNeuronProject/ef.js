import chalk from 'chalk'

// Rollup plugins
import eslint from '@rollup/plugin-eslint'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import progress from 'rollup-plugin-progress'

const isProduction = process.env.NODE_ENV === 'production'

// Log build environment
console.log('Build Target:', chalk.bold.green(process.env.BUILD_TARGET || 'development'))

export default {
	input: 'src/ef.js',
	output: {
		name: 'ef',
		format: 'umd',
		sourcemap: true
	},
	bundle: 'ef',
	devPath: 'test',
	proPath: 'dist',
	plugins: [
		progress({
			clearLine: false
		}),
		eslint({
			exclude: ['*.json', '**/*.json']
		}),
		resolve({
			browser: true,
		}),
		commonjs(),
		esbuild({
			target: 'es2015',
			sourceMap: true,
			minify: isProduction,
			define: {
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
			}
		})
	]
}
