// Import everything
import parse from './lib/parser.js'
import state from './lib/renderer.js'
import typeOf from './lib/utils/type-of.js'
import { mixStr } from './lib/utils/literals-mix.js'
import parseEft from 'eft-parser'
import { onRender, inform, exec, bundle } from './lib/utils/render-query.js'
import { version } from '../package.json'

// Set parser
let parser = parseEft

const create = (value) => {
	const valType = typeOf(value)
	if (valType === 'string') value = parse(value, parser)
	else if (valType !== 'array') throw new TypeError('Cannot create new component without proper template or AST!')

	const ast = value
	const ef = class extends state {
		constructor(newState) {
			inform()
			super(ast)
			if (newState) this.$update(newState)
			exec()
		}
	}
	return ef
}

// Change parser
const setParser = (newParser) => {
	parser = newParser
}

const t = (...args) => create(mixStr(...args))

export { create, onRender, inform, exec, bundle, setParser, parseEft, t, version }

if (ENV !== 'production') console.info('[EF]', `ef.js v${version} initialized!`)
