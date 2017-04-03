/* Ast structure:
 * ast = [
 * 	{
 * 		tag: 'div',
 * 		attr: {
 * 			class: [['class'], 'some classname'],
 * 			style: [['attr', 'style']],
 * 			id: 'testdiv',
 * 			'some-attr': 'some text'
 * 			content: null
 * 		},
 * 		prop: {
 * 			title: [['name']],
 * 			anotherProperty: 'text',
 * 			contentEditable: [['edit']]
 * 		}
 * 		event: {
 * 			click: ['updateInfo', ['info']],
 * 			mousedown: 'setState'
 * 		}
 * 	},
 * 	'name: ',
 * 	[['name']],
 * 	'\nJob: ',
 * 	[['job']],
 * 	[
 * 		{
 * 			tag: 'br',
 * 		}
 * 	],
 * 	{ name: 'node1', type: 'node' },
 * 	[
 * 		{
 * 			tag: 'p',
 * 			attr: {
 * 				class: 'some class name'
 * 			}
 * 		},
 * 		[
 * 			{
 * 				tag: 'span'
 * 			},
 * 			'Notice: ',
 * 			[['notice']]
 * 		],
 * 		'some text',
 * 		{ name: 'node2', type: 'node' },
 * 		{ name: 'list1', type: 'list' }
 * 	]
 * ]
 */

import create from './utils/creator.js'
import { resolveSubscriber } from './utils/resolver.js'
import initBinding from './utils/binding.js'
import ARR from './utils/array-helper.js'
import { assign } from './utils/polyfills.js'
import deepAssign from 'deep-assign'

const unsubscribe = (path, fn, subscriber) => {
	const subscriberNode = resolveSubscriber(path, subscriber)
	const index = subscriberNode.indexOf(fn)
	if (index === -1) return
	ARR.remove(subscriberNode, fn)
}

const checkAttached = function () {
	return !!this.$element.parentNode
}

const update = function (state) {
	const tmpState = assign({}, state)
	if (tmpState.$data) {
		assign(this.$data, tmpState.$data)
		delete(tmpState.$data)
	}
	if (tmpState.$methods) {
		assign(this.$methods, tmpState.$methods)
		delete(tmpState.$methods)
	}
	assign(this, tmpState)
}

const destroy = function() {
	for (let i in this) {
		this[i] = null
		delete this[i]
	}
	delete this.$element
	delete this.$data
	delete this.$methods
	delete this.$subscrib
	delete this.$unsubscribe
	delete this.$attached
	delete this.$update
	delete this.$destroy
}

const render = (ast) => {
	const state = {}
	const children = {}
	const nodes = {}
	const data = {}
	const innerData = {}
	const methods = {}
	const subscriber = {}
	Object.defineProperties(state, {
		$data: {
			get() {
				return data
			},
			set(newData) {
				deepAssign(data, newData)
			},
			configurable: true
		},
		$methods: {
			get() {
				return methods
			},
			set(newMethods) {
				deepAssign(methods, newMethods)
			},
			configurable: true
		},
		$nodes: {
			get() {
				return nodes
			},
			configurable: true
		},
		$subscribe: {
			value: (pathStr, handler) => {
				const path = pathStr.split('.')
				initBinding({bind: [path], state, subscriber, innerData, handler})
			},
			configurable: true
		},
		$unsubscribe: {
			value: (path, fn) => {
				unsubscribe(path, fn, subscriber)
			},
			configurable: true
		},
		$attached: {
			get: checkAttached,
			configurable: true
		},
		$update: {
			value: update,
			configurable: true
		},
		$destroy: {
			value: destroy,
			configurable: true
		}
	})
	const element = create({ast, state, innerData, nodes, children, subscriber, create})
	Object.defineProperty(state, '$element', {
		value: element,
		configurable: true
	})
	return state
}

export default render
