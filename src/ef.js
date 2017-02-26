/* global VERSION */

// Import everything
import { info } from './debug.js'
import { _ast } from './share.js'
// import parse from './lib/parser.js'
import render from './lib/renderer.js'

// Construct the class
const ef = class {

	constructor(value) {
		// const valType = Object.prototype.toString.call(value)
		// if (valType === '[object String]') value = parse(value)
		// else if (valType !== '[object Array]') throw new TypeError('Cannot create new component without proper template or AST!')
		_ast.set(this, value)
	}

	render(data) {
		return render(this, data)
	}
}

export default ef

info(`ef.js v${VERSION} initialized!`)
