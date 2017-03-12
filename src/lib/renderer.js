/* Ast structure:
 * ast = [
 * 	{
 * 		tag: 'div',
 * 		attr: {
 * 			class: ['class'],
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
import { resolvePath, resolve } from './utils/resolver'
import initSubscribe from './utils/subscriber.js'
import ARR from './utils/array-helper.js'
import deepAssign from 'deep-assign'

const resolveSubscriber = (path, subscriber) => {
	const pathArr = path.split('.')
	const name = pathArr.pop()
	return resolvePath(pathArr, subscriber)[name]
}

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
	const tmpState = Object.assign({}, state)
	if (tmpState.$data) {
		Object.assign(this.$data, tmpState.$data)
		delete(tmpState.$data)
	}
	if (tmpState.$methods) {
		Object.assign(this.$methods, tmpState.$methods)
		delete(tmpState.$methods)
	}
	Object.assign(this, tmpState)
}

const render = (ast) => {
	const state = {}
	const children = {}
	const data = {}
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
		$subscribe: {
			value: (path, fn) => {
				const pathArr = path.split('.')
				const name = pathArr.pop()
				const { parentNode, subscriberNode } = resolve({
					path: pathArr,
					name: name,
					parentNode: data,
					subscriberNode: subscriber
				})
				subscriberNode.push(fn)
				initSubscribe({subscriberNode, parentNode, name, state})
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
	const element = create({ ast, state, children, subscriber })
	// deepAssign(state, data)
	Object.defineProperty(state, '$element', {
		value: element
	})
	return state
}

export default render
