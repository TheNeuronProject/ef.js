var ast = [
	{
		tag: 'div',
		attr: {
			id: 'id1',
			class: ['text']
		}
	},
	'text0',
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

state.branch2 = [
	component.render(),
	component.render()
]

state.$methods.sendMsg = (thisState) => alert(`The message is "${thisState.$data.text}"!`)

document.querySelector('body').appendChild(state.$element)
