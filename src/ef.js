/* global VERSION */

// Import everything
import { info } from './debug.js'
import { _ast } from './share.js'
// import parse from './lib/parser.js'
import render from './lib/renderer.js'

// Construct the class
const ef = class {
	// constructor(template) {
	// 	if (!template) throw new Error('Cannot create new component without template!')
	// 	_ast.set(this, parse(template))
	// }

	constructor(ast) {
		_ast.set(this, ast)
	}

	$render(data) {
		return render(this, data)
	}
}

export default ef

info(`ef.js v${VERSION} initialized!`)
