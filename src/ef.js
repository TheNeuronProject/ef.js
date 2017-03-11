/* global VERSION */

// Import everything
import { info } from './lib/debug.js'
import parse from './lib/parser.js'
import render from './lib/renderer.js'

// Mock provate properties
const _ast = new WeakMap()

// Set parser
let parser = null

// Construct the class
const ef = class {

	constructor(value) {
		const valType = Object.prototype.toString.call(value)
		if (valType === '[object String]') value = parse(value, parser)
		else if (valType !== '[object Array]') throw new TypeError('Cannot create new component without proper template or AST!')
		_ast.set(this, value)
	}

	render() {
		return render(_ast.get(this))
	}

	static setPatser(newParser) {
		parser = newParser
	}
}

export default ef

info(`ef.js v${VERSION} initialized!`)
