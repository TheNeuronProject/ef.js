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
		{ name: 'branch', type: 'node' },
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
	{ name: 'list', type: 'list' }
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

var module = new ef(ast)

var state = module.render()
var state2 = module.render()
var state3 = module.render()
var state4 = module.render()

// state.list = [state2, state3]

state2.branch = state4

// state.$data.text = 'box'
state2.$data.text = 'box'
state3.$data.text = 'box'
state4.$data.text = 'box'

// state.$data.root.text = 'component 1'
state2.$data.root.text = 'component 2'
state3.$data.root.text = 'component 3'
state4.$data.root.text = 'On this node that button works.'

state.$update({
	$data: {
		text: 'box',
		root: {
			text: 'component 1'
		}
	},
	list: [state2, state3]
})

state4.$methods.sendMsg = function(thisState) { alert('The message is "' + thisState.$data.text + '"!') }

document.querySelector('body').appendChild(state.$element)
