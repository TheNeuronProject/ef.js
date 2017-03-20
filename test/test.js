var ast = [
	{
		tag: 'div',
		attr: {
			id: 'id1',
			class: ['text', ['box test']]
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
			alias: 'testAlias',
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
					value: ['style', ['background-color: #ECECEC']]
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

var template = 'this is a comment\n' +
'>div\n' +
'	#class = {{class}}\n' +
'	#style = {{attr.style}}\n' +
'	#id = testdiv\n' +
'	#some-attr = some text\n' +
'	#content =\n' +
'	%title = {{name}}\n' +
'	%anotherProperty = text\n' +
'	.Name: {{name}}&nJob: {{job}}\n' +
'	>br\n' +
'	-node1\n' +
'	>p\n' +
'		#class = some class name\n' +
'		@click = alertNotice\n' +
'		/@mousedown = setState\n' +
'		>span\n' +
'			.Notice: {{notice}}\n' +
'		. test\n' +
'	 	-node2\n' +
'		+list1'

var data1 = {
	$data: {
			class: 'box test class',
			name: 'Bob',
			job: 'Assit Alice',
			notice: 'ooooooops'
	},
	$methods: {
		alertNotice: function (state) {
			alert(state.$data.notice)
		}
	}
}

var module1 = new ef(ast)
var module2 = new ef(template)

var state = module1.render()
var state2 = module1.render()
var state3 = module2.render()
var state4 = module2.render(data1)

state3.list1.push(state4)
state2.branch = state3

// state.$data.text = 'box'
// state2.$data.text = 'box'
// state3.$data.text = 'box'
// state4.$data.text = 'box'

// state.$data.root.text = 'component 1'
state2.$data.root.text = 'component 2'
state3.$data.class = 'box'
state3.$data.name = 'Alice'
state3.$data.job = 'Developer'
state3.$data.notice = 'N/A'
state4.$data.job = 'Assiting Alice'

var data2 = {
	$data: {
		text: 'box',
		root: {
			text: 'On this node that button works.'
		}
	},
	$methods: {
		sendMsg: function (state) {
			alert('The message is \n"' + state.$data.text + '"!')
		}
	},
	list: [state2]
}

state.$update(data2)

// state4.$methods.sendMsg = function(thisState) { alert('The message is "\n' + thisState.$data.text + '"!') }

document.querySelector('body').appendChild(state.$element)
