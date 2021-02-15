var template =
'>div.{{class.text = box test}}' +
'\n	#testattr' +
'\n #emptyattr = {{empty}}' +
'\n	#id = id1' +
'\n	.text0' +
'\n	>br' +
'\n	.{{root.text}}' +
'\n	>br' +
'\n	.This should not be undefined:' +
'\n	>input' +
'\n		%value = {{nobody_use_field}}' +
'\n	>br' +
'\n	.Custom emit event:' +
'\n	>input' +
'\n		%value = {{value}}' +
'\n	>br' +
'\n	.{{class.text}}' +
'\n	>div#testRef' +
'\n		#style = {{style}}' +
'\n		.text1{{info.node1}}' +
'\n		-branch' +
'\n		>br' +
'\n		.Message: ' +
'\n		>br' +
'\n		.Two way binded 1: ' +
'\n		>input' +
'\n			#type = text' +
'\n			%value = {{class.text}}' +
'\n		>br' +
'\n		.Two way binded 2: ' +
'\n		>input' +
'\n			#type = text' +
'\n			%value = {{class.text2 = 23333}}' +
'\n		>br' +
'\n		.One way binded with particle update:' +
'\n		>input' +
'\n			#type = text' +
'\n			%value = 1: {{class.text}} 2: {{class.text2}}' +
'\n		>br' +
'\n		>input' +
'\n			#type = radio' +
'\n			#name = testradio' +
'\n			%checked = {{testRadio1 = true}}' +
'\n		.checked: {{testRadio1}}' +
'\n		>input' +
'\n			#type = radio' +
'\n			#name = testradio' +
'\n			%checked = {{testRadio2 = false}}' +
'\n		.checked: {{testRadio2}}' +
'\n		>input' +
'\n			#type = checkbox' +
'\n			%checked = {{testCheck = true}}' +
'\n		.checked: {{testCheck}}' +
'\n		>br' +
'\n		.Input style here: ' +
'\n		>br' +
'\n		>textarea' +
'\n			%value = {{style = background-color: #ECECEC}}' +
'\n			@keydown.ctrl.13.27 = key' +
'\n			@keydown.13.32 = space' +
'\n		>br' +
'\n		>br' +
'\n		>input' +
'\n			#type = number' +
'\n			%value = {{numInput = 0}}' +
'\n		. x 3 = ' +
'\n		>input' +
'\n			#type = number' +
'\n			%value = {{numOutput}}' +
'\n		>br' +
'\n		.{{text}}text2' +
'\n	>button' +
'\n		@click = sendMsg:some data' +
'\n		.{{btnText = sendMsg}}' +
'\n	>br' +
'\n	>input' +
'\n		%value@keypress.13 = {{enterUpdateValue}}' +
'\n	>span' +
'\n		.Enter at the input box to update this value: {{enterUpdateValue}}' +
'\n	>br' +
'\n	>input' +
'\n		%value@keypress.ctrl.13 = {{enterWithCtrlUpdateValue}}' +
'\n	>span' +
'\n		.Enter with ctrl pressed at the input box to update this value: {{enterWithCtrlUpdateValue}}' +
'\n	>br' +
'\n	>input' +
'\n		%value = {{updateOnly}}' +
'\n	>span' +
'\n		.This is an update only textbox:' +
'\n	>input' +
'\n		%value! = {{updateOnly}}' +
'\n	+list' +
'\n	+children'

var template2 = '  this is a comment' +
'\n  >div.{{class = some class name}}' +
'\n    #style = {{attr.style}}' +
'\n    #id = testdiv' +
'\n  	#some-attr = some text' +
'\n  	#content =' +
'\n  	%title = {{name}}' +
'\n  	%anotherProperty = text' +
'\n  	.Name: {{name}}&nJob: {{job}}' +
'\n  	>br' +
'\n  	-node1' +
'\n  	>p' +
'\n  		#class = some class name' +
'\n  		@click.shift.alt.stop = alertNotice:{{attr.style = color: #666}}' +
'\n  		@mousedown = setState' +
'\n  		@click.capture.stop = capture' +
'\n  		>span' +
'\n  	  	.Notice: {{notice = ]]}}' +
'\n  		. test' +
'\n  		-node2' +
'\n  		+list1' +
'\n  -node3' +
'\n  +list2'

var template3 =
'\n>module1' +
'\n  %value = {{aaa}}' +
'\n  @testevent = test:{{aaa}}' +
'\n  %root.text = {{aaa}}' +
'\n  #branch = {{branch}}' +
'\n  .{{aaa = 12345}}' +
'\n  >input' +
'\n    %value = {{aaa}}' +
'\n  >button' +
'\n    @click = click:{{aaa}}' +
'\n    .button' +
'\n  -mount' +
'\n  +list' +
'\n>module2' +
'\n.{{aaa}}'

var template4 =
'\n>h1' +
'\n  .This should be a button'

var template5 =
'\n>button' +
'\n  #is = my-btn' +
'\n  .Click this should be get an alert'

var data1 = {
	$data: {
			class: 'box test class',
			name: 'Bob',
			job: 'Assist Alice',
			notice: 'Hold shift and alt and then click here. An alert should pop up'
	},
	$methods: {
		alertNotice: function (info) {
			alert(info.state.$data.notice)
		}
	}
}

var module1 = ef.create(template)
var module2 = ef.create(template2)
var module3 = ef.create(template3)
var module4 = ef.create(template4)
var module5 = ef.create(template5)

class module1_1 extends module1 {
	constructor(...args) {
		super(...args)
		this.$subscribe('value', ({value}) => {
			this.$emit('input')
		})
	}
}

ef.inform()

var state = new module1()
var state2 = new module1()
var state3 = new (class extends module2 {
	$mount(...args) {
		console.log('MMMOUNT!!')
		return super.$mount(...args)
	}
	$umount(...args) {
		console.log('UUUMOUNT!!')
		return super.$umount(...args)
	}
})()
var state4 = new module2(data1)
var state5 = new module3(null, {module1: module1_1, module2: module2})

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
// state3.$data.notice = 'N/A'
state4.$data.job = 'Assisting Alice'

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

state.$subscribe('numInput', ({state, value}) => {
	console.log('IN', value)
	state.$data.numOutput = parseFloat(value, 10) * 3
})
state.$subscribe('numOutput', ({state, value}) => {
	console.log('OUT', value)
	state.$data.numInput = parseFloat(value, 10) / 3
})

var states = []

state2.$data.style = '100'

state2.$data.btnText = 'Run Test!'

state2.$subscribe('style', function (info) {
	state2.$data.text = 'Click the button below to run a ' + info.value + ' components render test.'
})

state2.$methods.sendMsg = function (info) {
	ef.inform()
	var count = parseInt(info.state.$data.style)
	var startTime = Date.now()
	console.time('Create')
	for (var i = 0; i < count; i++) states.push(new module1())
	state4.list1.push.apply(state4.list1, states)
	// ef.exec()
	console.timeEnd('Create')
	var endTime = Date.now()
	var time = endTime - startTime
	var msg = '' + count + ' components rendered in ' + time + 'ms.'
	info.state.$data.text = msg
	console.log(msg)
	// states = []
	// ef.inform()
	startTime = Date.now()
	console.time('Destroy')
	for (var i = 0; i < states.length; i++) {
		states[i].$destroy()
	}
	ef.exec()
	console.timeEnd('Destroy')
	endTime = Date.now()
	states = []
	time = endTime - startTime
	msg = '' + count + ' components destroied in ' + time + 'ms.'
	console.log(msg)
}

// state4.$methods.sendMsg = function(thisState) { alert('The message is "\n' + thisState.$data.text + '"!') }
state.$mount({target: document.body})
state5.$mount({target: document.body})

ef.declareNamespace('aaa', 'test')

var customBtn = class extends HTMLButtonElement {
	constructor(...args) {
		super(...args)
		this.addEventListener('click', () => {alert('my button clicked')})
	}
}
customElements.define('my-btn', customBtn, {extends: 'button'})
var state6 = new module4(null, {h1: customBtn})
state6.$mount({target: document.body})

var state7 = new module4(null, {h1: {tag: 'aaa:button', is: 'my-btn'}})
state7.$mount({target: document.body})

var state8 = new module5
state8.$mount({target: document.body})
ef.exec()

const {inform, exec, create, scoped} = ef

const ListHolder = ef.create(`+children`)
const LogicContainer = ef.create(`-childrenHolder`)

const efLogic = class extends LogicContainer {
	constructor(...args) {
		inform()
		super(...args)
		this.$ctx.childrenHolder = new ListHolder()
		exec()
	}

	set ifTrue(value) {
		if (value) this.childrenHolder = this.$ctx.childrenHolder
		else this.childrenHolder = null
	}

	set ifFalse(value) {
		if (value) this.childrenHolder = null
		else this.childrenHolder = this.$ctx.childrenHolder
	}

	get children() {
		return this.$ctx.childrenHolder.children
	}

	set children(children) {
		this.$ctx.childrenHolder.children = children
	}
}

const App = scoped(ef.t`
>br
>input
	#type = checkbox
	#id = input-box
	%checked = {{show = true}}
>label
	#for = input-box
	.{{show}}
>Logic#logic
	#ifTrue = {{show}}
	>pre
		.Show only when checkbox is checked!
	.---layer {{layer}} start---
	+list
	>br
	-mount
	.---layer {{layer}} end---
>br
`, {Logic: efLogic})

inform()
const app = new App({$data: {show: true, layer: 0}})

app.list.push(new App({$data: {show: false, layer: 1}}))
exec()

app.list[0].list.push(new App({$data: {show: false, layer: 2}}))

app.$mount({target: document.body})


const MyAudioPlayer = ef.t`
.All audio controls are implemented without a single line of extra JavaScript.
>br
>audio
	%currentTime@timeupdate = {{currentTime}}
	%duration!@canplay = {{duration}}
	%src = {{src}}
	%autoplay = {{autoplay = true}}
	#controls
>div
	.Select an audio file: &
	>input
		#type = file
		#accept = audio/*
		%files!@change = {{files}}
	>br
	.Custom progress bar: &
	>input
		#type = range
		#step = 0.01
		#max = {{duration = 0}}
		%value = {{currentTime = 0}}
	>br
	.Autoplay: &
	>input
		#type = checkbox
		%checked = {{autoplay}}
	>pre
		|Current time: {{currentTime}}
		|Total length: {{duration}}
`

const myPlayer = new MyAudioPlayer()

myPlayer.$subscribe('files', ({state, value}) => {
	if (value && value[0]) {
		state.$data.src = URL.createObjectURL(value[0])
	}
})

myPlayer.$mount({target: document.body})
