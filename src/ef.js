// Import everything
import { info } from './lib/debug.js'
import parse from './lib/parser.js'
import state from './lib/renderer.js'
import typeOf from './lib/utils/type-of.js'
import { mixStr } from './lib/utils/literals-mix.js'
import eftParser from 'eft-parser'
import { inform, exec } from './lib/utils/render-query.js'
import { version } from '../package.json'

// Set parser
let parser = eftParser

// Construct the class
const ef = class {
	constructor(value) {
		const valType = typeOf(value)
		if (valType === 'string') value = parse(value, parser)
		else if (valType !== 'array') throw new TypeError('Cannot create new component without proper template or AST!')

		const ast = value
		Object.defineProperty(this, 'render', {
			value: (newState) => {
				inform()
				const result = new state(ast)
				if (newState) result.$update(newState)
				exec()
				return result
			}
		})
	}

	static inform() {
		return inform()
	}

	static exec(immediate) {
		return exec(immediate)
	}

	static bundle(cb) {
		inform()
		return exec(cb(inform, exec))
	}

	static setPatser(newParser) {
		parser = newParser
	}

	static parseEft(template) {
		return eftParser(template)
	}

	static t(...strs) {
		return new ef(mixStr(...strs))
	}
}

export default ef

info(`ef.js v${version} initialized!`)
