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

import { warn } from './debug.js'
import create from './utils/creator.js'
import { resolvePath } from './utils/resolver'
import ARR from './utils/array-helper.js'
// import deepAssign from 'deep-assign'

const resolveSubscriber = (path, subscriber) => {
	const pathArr = path.split('.')
	return resolvePath(pathArr, subscriber)[pathArr[pathArr.length - 1]]
}

const subscribe = (path, fn, subscriber) => {
	const subscriberNode = resolveSubscriber(path, subscriber)
	if (!subscriberNode) return warn(`Nothing to subscribe on '${path}'!`)
	if (subscriberNode.indexOf(fn) === -1) subscriberNode.push(fn)
}

const unsubscribe = (path, fn, subscriber) => {
	const subscriberNode = resolveSubscriber(path, subscriber)
	const index = subscriberNode.indexOf(fn)
	if (index === -1) return
	ARR.remove(subscriberNode, fn)
}

const render = (ast) => {
	const state = {}
	const children = {}
	const subscriber = {}
	Object.defineProperties(state, {
		$data: {
			value: {}
		},
		$methods: {
			value: {}
		},
		$subscribe: {
			value: (path, fn) => {
				subscribe(path, fn, subscriber)
			}
		},
		$unsubscribe: {
			value: (path, fn) => {
				unsubscribe(path, fn, subscriber)
			}
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
