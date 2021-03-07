import chalk from 'chalk'

// Rollup plugins
import {eslint} from 'rollup-plugin-eslint'
import {terser} from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import buble from '@rollup/plugin-buble'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import progress from 'rollup-plugin-progress'

switch (process.env.BUILD_ENV) {
	case 'DEV': {
		console.log(chalk.cyan('+--------------=+| DEVELOP BUILD |+=--------------+'))
		break
	}
	case 'CI': {
		console.log(chalk.green('+--------------=+| CI BUILD |+=--------------+'))
		break
	}
	default: {
		console.log(chalk.yellow('+--------------=+| NORMAL BUILD |+=--------------+'))
	}
}

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
		json(),
		replace({
			preventAssignment: true,
			values: {
				'process.env.NODE_ENV': `'${process.env.BUILD_TARGET || 'development'}'`
			}
		}),
		buble({
			transforms: {
				modules: false,
				dangerousForOf: true
			},
			objectAssign: 'Object.assign'
		}),
		(process.env.BUILD_TARGET === 'production' && terser())
	]
}
