var ast = [
	{
		t: 'div',
		a: {
			id: 'id1',
			class: [['class', 'text'], 'box test']
		}
	},
	'text0',
	[
		{
			t: 'br'
		}
	],
	[['root', 'text']],
	[
		{
			t: 'br'
		}
	],
	[['class', 'text']],
	[
		{
			t: 'div',
			n: 'testAlias',
			a: {
				style: [['style']]
			}
		},
		'text1',
		[['info', 'node1']],
		{ n: 'branch', t: 0 },
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
				t: 'input',
				a: {
					type: 'text'
				},
				p: {
					value: [['class', 'text']]
				}
			}
		],
		[
			{
				t: 'br'
			}
		],
		'Input style here: ',
		[
			{
				t: 'br'
			}
		],
		[
			{
				t: 'textarea',
				p: {
					value: [['style'], 'background-color: #ECECEC']
				},
				e: [
					{ l: 'keydown', c: 1, m: 'key', k: [13, 27] },
					{ l: 'keydown', m: 'space', k: [13, 32] }
				]
			}
		],
		[
			{
				t: 'br'
			}
		],
		[['text']],
		'text2'
	],
	[
		{
			t: 'button',
			e: [
				{ l: 'click', m: 'sendMsg', v: 'some data' }
			]
		},
		'sendMsg'
	],
	{ n: 'list', t: 1 }
]

var template = '  this is a comment\n' +
'  >div.{{class = some class name}}\n' +
'    #style = {{attr.style}}\n' +
'    #id = testdiv\n' +
'  	#some-attr = some text\n' +
'  	#content =\n' +
'  	%title = {{name}}\n' +
'  	%anotherProperty = text\n' +
'  	.Name: {{name}}&nJob: {{job}}\n' +
'  	>br\n' +
'  	-node1\n' +
'  	>p\n' +
'  		#class = some class name\n' +
'  		@click.shift.alt.stop = alertNotice:{{attr.style = color: #666}}\n' +
'  		@mousedown = setState\n' +
'  		@click.capture.stop = capture\n' +
'  		>span\n' +
'  	  	.Notice: {{notice = ]]}}\n' +
'  		. test\n' +
'  		-node2\n' +
'  		+list1'

var ast2 = ef.parseEft(template)

var data1 = {
	$data: {
			class: 'box test class',
			name: 'Bob',
			job: 'Assit Alice',
			notice: 'Hold shift and alt and then click here. An alert should pop up'
	},
	$methods: {
		alertNotice: function (info) {
			alert(info.state.$data.notice)
		}
	}
}

var module1 = new ef(ast)
// var module2 = new ef(ast2)

var state = module1.render()
var state2 = module1.render()
// var state3 = module2.render()
// var state4 = module2.render(data1)

// state3.list1.push(state4)
// state2.branch = state3

// state.$data.text = 'box'
// state2.$data.text = 'box'
// state3.$data.text = 'box'
// state4.$data.text = 'box'

// state.$data.root.text = 'component 1'
state2.$data.root.text = 'component 2'
// state3.$data.class = 'box'
// state3.$data.name = 'Alice'
// state3.$data.job = 'Developer'
// // state3.$data.notice = 'N/A'
// state4.$data.job = 'Assiting Alice'

var data2 = {
	$data: {
		text: 'box',
		root: {
			text: 'On this node that button works.'
		}
	},
	$methods: {
		sendMsg: function (info) {
			console.log('Event triggered:', info.e)
			console.log('Value passed:', info.value)
			alert('The message is \n"' + info.state.$data.class.text + '"!')
		}
	},
	list: [state2]
}

state.$update(data2)

var states = []

state2.$data.style = '10000'

state2.$subscribe('style', function (val) {
	state2.$data.text = 'Click the button below to run a ' + val + ' components render test.'
})

state2.$methods.sendMsg = function (info) {
	var count = parseInt(info.state.$data.style)
	var startTime = Date.now()
	for (var i = 0; i < count; i++) states.push(module1.render())
	// state4.list1.push.apply(state4.list1, states)
	var endTime = Date.now()
	for (var i = 0; i < states.length; i++) {
		states[i].$destroy()
		states[i] = null
	}
	states = []
	var time = endTime - startTime
	var msg = '' + count + ' components rendered in ' + time + 'ms.'
	info.state.$data.text = msg
	console.log(msg)
}

// state4.$methods.sendMsg = function(thisState) { alert('The message is "\n' + thisState.$data.text + '"!') }

document.querySelector('body').appendChild(state.$element)
