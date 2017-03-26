/* Ast structure:
 * ast = [
 * 	{
 * 		tag: 'div',
 * 		attr: {
 * 			class: ['class', ['some classname']],
 * 			style: ['attr', 'style'],
 * 			id: 'testdiv',
 * 			'some-attr': 'some text'
 * 			content: null
 * 		},
 * 		prop: {
 * 			title: ['name'],
 * 			anotherProperty: 'text',
 * 			contentEditable: ['edit']
 * 		}
 * 		event: {
 * 			click: 'updateInfo',
 * 			mousedown: 'setState'
 * 		}
 * 	},
 * 	'name: ',
 * 	['name'],
 * 	'\nJob: ',
 * 	['job'],
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
 * 			['notice']
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

const render = (ast) => {
	ast = ARR.fullCopy(ast)
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
			}
		},
		$methods: {
			get() {
				return methods
			},
			set(newMethods) {
				deepAssign(methods, newMethods)
			}
		},
		$nodes: {
			get() {
				return assign({}, nodes)
			}
		},
		$subscribe: {
			value: (pathStr, fn) => {
				const path = pathStr.split('.')
				initBinding({path, state, subscriber, innerData, fn})
			}
		},
		$unsubscribe: {
			value: (path, fn) => {
				unsubscribe(path, fn, subscriber)
			}
		},
		$attached: {
			get: checkAttached
		},
		$update: {
			value: update
		}
	})
	const element = create({ast, state, innerData, nodes, children, subscriber})
	Object.defineProperty(state, '$element', {
		value: element
	})
	return state
}

export default render
