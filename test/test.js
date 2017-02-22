var ast = [
	{
		tag: 'div',
		attr: {
			id: 'id1',
			class: ['text']
		},
		event: {
			click: 'sendMsg'
		}
	},
	'text0',
	['root', 'text'],
	['text'],
	[
		{
			tag: 'div'
		},
		'text1',
		['info', 'node1'],
		{ name: 'branch1' },
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
					value: ['input']
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

var state = component.$render()

// state.branch1 = component

// state.$methods.sendMsg = () => alert('Message1 sent!')
// state.branch1.$methods.sendMsg = () => alert('Message2 sent!')

document.querySelector('body').appendChild(state.$element)
