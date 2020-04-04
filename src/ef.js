// Import everything
import parse from './lib/parser.js'
import typeOf from 'ef-core/src/lib/utils/type-of.js'
import { mixStr } from 'ef-core/src/lib/utils/literals-mix.js'
import parseEft from 'eft-parser'
import { version } from '../package.json'
// Import core components
import {
	create as createComponent,
	createElement,
	mapAttrs,
	EFNodeWrapper,
	EFTextFragment,
	Fragment,
	scoped,
	onNextRender,
	inform,
	exec,
	bundle,
	isPaused,
	mountOptions
} from 'ef-core'

// Set parser
let parser = parseEft

/**
 * @typedef {import('ef-core/src/lib/renderer.js').EFAST} EFAST
 * @typedef {import('ef-core/src/ef-core.js').EFComponent} EFComponent
 */

/**
 * Return a brand new class for the new component
 * @param {string|EFAST} value - Template or AST for the component
 * @returns {EFComponent} - Created component class from AST
 */
const create = (value) => {
	const valType = typeOf(value)
	if (valType === 'string') value = parse(value, parser)
	else if (valType !== 'array') throw new TypeError('Cannot create new component without proper template or AST!')

	return createComponent(value)
}

/**
 * Change parser
 * @param {Function} newParser - Parser you want to change with
 * @returns {void}
 */
const setParser = (newParser) => {
	parser = newParser
}

/**
 * Tagged template to quickly create an inline ef component class
 * @param {...*} args - String literal
 * @returns {EFComponent} - Created ef component class
 */
const t = (...args) => create(mixStr(...args))

export {
	t,
	create,
	createElement,
	mapAttrs,
	EFNodeWrapper,
	EFTextFragment,
	Fragment,
	scoped,
	onNextRender,
	inform,
	exec,
	bundle,
	isPaused,
	setParser,
	parseEft,
	mountOptions,
	version
}

if (process.env.NODE_ENV !== 'production') console.info(`[EF] ef.js v${version} initialized!`)
