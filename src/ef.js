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
	registerProps,
	TextFragment,
	Fragment,
	onNextRender,
	inform,
	exec,
	bundle,
	isPaused,
	mountOptions
} from 'ef-core'

// Set parser
let parser = parseEft

const create = (value) => {
	const valType = typeOf(value)
	if (valType === 'string') value = parse(value, parser)
	else if (valType !== 'array') throw new TypeError('Cannot create new component without proper template or AST!')

	return createComponent(value)
}

// Change parser
const setParser = (newParser) => {
	parser = newParser
}

const t = (...args) => create(mixStr(...args))

export {
	t,
	create,
	createElement,
	registerProps,
	TextFragment,
	Fragment,
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
