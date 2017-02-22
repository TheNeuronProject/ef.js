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
// import deepAssign from 'deep-assign'

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
