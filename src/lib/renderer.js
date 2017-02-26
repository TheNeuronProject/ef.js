/* Ast structure:
 * ast = [
 * 	{
 * 		tag: 'div',
 * 		attr: {
 * 			id: 'id1',
 * 			class: ['root', 'class']
 * 		},
 * 		event: {
 * 			click: 'sendMsg',
 * 			keydown: 'checkInput'
 * 		}
 * 	},
 * 	'text0',
 * 	['root', 'text'],
 * 	[
 * 		{
 * 			tag: 'div',
 * 			attr: {...},
 * 			event: {...}
 * 		},
 * 		'text1',
 * 		['info', 'node1'],
 * 		{ name: 'branch1' },
 * 		[
 * 			{
 * 				tag: 'input',
 * 				attr: {
 * 					type: 'text'
 * 				},
 * 				prop: {
 * 					value: ['input']
 * 				},
 * 				event: {...}
 * 			},
 * 			'text2',
 * 			...
 * 		]
 * 	],
 * 	{ name: 'branch2' },
 * 	[...]
 * ]
 */

import { _ast } from '../share.js'
import create from './utils/creator.js'
import { resolvePath } from './utils/resolver'
import { removeItem } from './utils/array-helper.js'
// import deepAssign from 'deep-assign'

const resolveSubscriber = (path, subscriber) => {
	const pathArr = path.split('.')
	return resolvePath(pathArr, subscriber)[pathArr[pathArr.length - 1]]
}

const subscribe = (path, fn, subscriber) => {
	const subscriberNode = resolveSubscriber(path, subscriber)
	if (subscriberNode.indexOf(fn) === -1) subscriberNode.push(fn)
}

const unsubscribe = (path, fn, subscriber) => {
	const subscriberNode = resolveSubscriber(path, subscriber)
	const index = subscriberNode.indexOf(fn)
	if (index === -1) return
	removeItem(subscriberNode, fn)
}

const render = (component) => {
	const ast = _ast.get(component)
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
