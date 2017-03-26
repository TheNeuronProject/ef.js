/* global GITVERSION */

// Import everything
import { info } from './lib/debug.js'
import parse from './lib/parser.js'
import render from './lib/renderer.js'
import typeOf from './lib/utils/type-of.js'
import eftParser from 'eft-parser'
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
			value: function (state) {
				const result = render(ast)
				if (state) result.$update(state)
				return result
			}
		})
	}

	static setPatser(newParser) {
		parser = newParser
	}

	static parseEft(template) {
		return eftParser(template)
	}
}

export default ef

info(`ef.js v${version}.${GITVERSION} initialized!`)
