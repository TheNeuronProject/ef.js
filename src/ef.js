// Import everything
import parse from './lib/parser.js'
import typeOf from 'ef-core/src/lib/utils/type-of.js'
import parseEft from 'eft-parser'
// Import core components
import {
	create as createComponent,
	mapAttrs,
	EFNodeWrapper,
	EFTextFragment,
	Fragment,
	toEFComponent,
	scoped,
	onNextRender,
	inform,
	exec,
	bundle,
	isPaused,
	setDOMImpl,
	declareNamespace,
	mountOptions
} from 'ef-core'

// Set parser
let parser = parseEft

/**
 * @typedef {import('ef-core/src/ef-core.js').EFMountOption} EFMountOption
 * @typedef {import('ef-core/src/ef-core.js').EFMountConfig} EFMountConfig
 * @typedef {import('ef-core/src/ef-core.js').EFAST} EFAST
 * @typedef {import('ef-core/src/ef-core.js').EFBaseClass} EFBaseClass
 * @typedef {import('ef-core/src/ef-core.js').EFEventHandlerArg} EFEventHandlerArg
 * @typedef {import('ef-core/src/ef-core.js').EFEventHandlerMethod} EFEventHandlerMethod
 * @typedef {import('ef-core/src/ef-core.js').EFSubscriberHandlerArg} EFSubscriberHandlerArg
 * @typedef {import('ef-core/src/ef-core.js').EFSubscriberHandlerMethod} EFSubscriberHandlerMethod
 * @typedef {import('ef-core/src/ef-core.js').EFTemplateScope} EFTemplateScope
 * @typedef {import('ef-core/src/ef-core.js').Fragment} Fragment
 * @typedef {import('ef-core/src/ef-core.js').EFNodeWrapper} EFNodeWrapper
 * @typedef {import('ef-core/src/ef-core.js').EFTextFragment} EFTextFragment
 * @typedef {import('ef-core/src/ef-core.js').EFEventOptions} EFEventOptions
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Return a brand new class for the new component
 * @param {string|EFAST} value - Template or AST for the component
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

const mixStr = (strs, ...vars) => {
	const strArr = new Array(strs.length + vars.length)
	for (let i in strs) strArr[i * 2] = strs[i]
	for (let i in vars) strArr[i * 2 + 1] = vars[i]
	return ''.concat(...strArr)
}

// eslint-disable-next-line valid-jsdoc
/**
 * Tagged template to quickly create an inline ef component class
 * @param {...*} args - String literal
 */
const t = (...args) => create(mixStr(...args))

let coreVersion = '0.17.4'

if (process.env.NODE_ENV !== 'production') {
	coreVersion = `${coreVersion}+debug`
}

export {
	t,
	create,
	mapAttrs,
	EFNodeWrapper,
	EFTextFragment,
	Fragment,
	toEFComponent,
	scoped,
	onNextRender,
	inform,
	exec,
	bundle,
	isPaused,
	setParser,
	parseEft,
	mountOptions,
	setDOMImpl,
	declareNamespace,
	coreVersion as version
}

if (process.env.NODE_ENV !== 'production') console.info(`[EF] ef.js v${coreVersion} initialized!`)
