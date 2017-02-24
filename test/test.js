var ast = [
	{
		tag: 'div',
		attr: {
			id: 'id1',
			class: ['text']
		}
	},
	'text0',
	[
		{
			tag: 'br'
		}
	],
	['root', 'text'],
	[
		{
			tag: 'br'
		}
	],
	['text'],
	[
		{
			tag: 'div',
			attr: {
				style: ['style']
			}
		},
		'text1',
		['info', 'node1'],
		{ name: 'branch1' },
		[
			{
				tag: 'br'
			}
		],
		'Message: ',
		[
			{
				tag: 'br'
			}
		],
		[
			{
				tag: 'input',
				attr: {
					type: 'text'
				},
				prop: {
					value: ['text']
				}
			}
		],
		[
			{
				tag: 'br'
			}
		],
		'Input style here: ',
		[
			{
				tag: 'br'
			}
		],
		[
			{
				tag: 'textarea',
				prop: {
					value: ['style']
				}
			}
		],
		[
			{
				tag: 'br'
			}
		],
		['text'],
		'text2'
	],
	[
		{
			tag: 'button',
			event: {
				click: 'sendMsg'
			}
		},
		'sendMsg'
	],
	{ name: 'branch2' }
]

// var data = {
// 	$data: {
// 		root: {
// 			class: 'test classes',
// 			text: 'test text'
// 		},
// 		info: {
// 			node1: 'node1'
// 		}
// 	},
// 	$methods: {
// 		sendMsg() {
// 			console.log('Message sent!')
// 		},
// 		checkInput() {
// 			console.log('Checking input, please wait...')
// 		}
// 	}
// }

var component = new ef(ast)

var state = component.render()
var state2 = component.render()
var state3 = component.render()
var state4 = component.render()

state.branch2 = [state2, state3]

state2.branch2 = state4

state.$data.text = 'box'
state2.$data.text = 'box'
state3.$data.text = 'box'
state4.$data.text = 'box'

state4.$data.root.text = 'On this node that button works.'

state4.$methods.sendMsg = (thisState) => alert(`The message is "${thisState.$data.text}"!`)

document.querySelector('body').appendChild(state.$element)
