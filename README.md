# ef.js [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/ClassicOldSong/ef.js/master/LICENSE) [![npm](https://img.shields.io/npm/dt/ef.js.svg?style=flat-square)](https://www.npmjs.com/package/ef.js) [![Build status](https://img.shields.io/travis/ClassicOldSong/ef.js.svg?style=flat-square)](https://travis-ci.org/ClassicOldSong/ef.js)
<img align="right" width="95" height="95" title="logo of ef" src="https://cloud.githubusercontent.com/assets/10512422/24116533/15dbd8b2-0de2-11e7-9ae8-6885f429a923.png">

(maybe) An elegant HTML template engine & basic framework

ef.js is a static template framework for browsers, which you can write your UI without concerning about the logic, or writing logic without concerning about the UI.

ef.js also provides a simple template-engine which helps you create component modules with data binding at ease, but you can also use your favourite template-engine if it can be parsed into ef.js's AST.

Demo:
+ [TodoMVC](https://classicoldsong.github.io/todomvc-efjs/) - [repo](https://github.com/ClassicOldSong/todomvc-efjs)
+ [dbmon](https://classicoldsong.github.io/js-repaint-perfs/ef/index.html) - [repo](https://github.com/ClassicOldSong/js-repaint-perfs)

Related projects:
+ [eft-parser](https://github.com/ClassicOldSong/eft-parser) - Parser for eft templates
+ [rollup-plugin-eft](https://github.com/ClassicOldSong/rollup-plugin-eft) - Import .ef and .eft templates directly from your code, taking the advantage of ef.js into your project with zero configuration.
+ [SublimeEFMLHighlighter](https://github.com/ClassicOldSong/SublimeEFMLHighlighter) - EFML syntax highlighter for SublimeText3
+ [VSCodeEFMLHighlighter](https://marketplace.visualstudio.com/items?itemName=ClassicOldSong.efml) - EFML syntax highlighter for VSCode
+ [AtomEFMLHighlighter](https://atom.io/packages/efml) - EFML syntax highlighter for Atom

Community project(s):
+ [EFML.vim](https://github.com/deluxghost/EFML.vim) by [deluxghost](https://github.com/deluxghost) - EFML (*.ef, *.eft) syntax highlighting for Vim

## Usage
``` javascript
import ef from 'ef.js'

ef.setParser(someparser) // Change the default parser for ef.js so you can use a different type of template
ef.parseEft('Your awesome template') // Get ef.js ast using default parser

const templateString = 'Your awesome template'
const ast = [/* AST which supported by ef */]

const data = {
	$data: {/* Binding data */}
	$methods: {/* Binding methods */}
}

const template1 = new ef(template)
const template2 = new ef(ast)
const template3 = ef.t`Your awesome template`

const component1 = template1.render() // Create a component without data
const component2 = template2.render(data) // Create a component and then updates it's data

component1.$element // The DOM element of component1
component2.$element // The DOM element of component2

component1.$data.something = 'something new' // Update the binding data 'something'
component2.$methods.someMethod = ({e, value, state}) => {
	state.$data.something = 'something new'
	console.log('Event target', e.target)
	console.log('Value passed', value)
} // Update binding method

const logData = val => console.log('Subscribed data updated:', val)
component1.$subscribe('info.data', logData) // Observe a value
component1.$unsubscribe('info.data', logData) // Stop observing a value

component1.$update(data) // Update the whole component state
component2.$attached // Check if the component has mounted to something

component1.$nodes // Get all named nodes

component1.mountingPoint = component2 // Mount component2 to 'mountingPoint' on component1
component1.mountingPoint = null // Detach the mounted component

component1.listMP.push(componet2) // Mount component2 to list 'listMP' mounting point on component1

component1.$destroy() // Destroy the component when not needed for more memory

```

## ef.js template language (EFML) format
EFML is a completely **logic-free** template language. Just like HTML, there you can do nothing about logic, but EFML provides a easy starting point for data binding and events handling.

Also EFML is the first language that can be parsed into the AST which ef supports.

**Note:** EFML is **very strict to indents**. Wrong indents could lead to a parsing error.

Here is an example.

```
Tree structure
Lines not started with >#%@.+- are considered as comments
The escape character of eft is '&', for prevention of the conflict with js escapes.
Except for the change of the character, all the usage should be the same.
this is a comment
'>' stands for tag name
>div
	'#' stands for attributes
	Mustaches stands for binding data
	content inside mustaches after '=' stands for the default value for this binding
	content without mustaches stands for a static data
	which means that you cannot modify them using ef.js
	#class = {{class = some class name}}
	#style = {{attr.style = background: #ECECEC}}
	#id = testdiv
	#some-attr = some text
	#content
	'%' stands for properties
	%title = {{name}}
	%anotherProperty = text
	'@' stands for events
	contents after ':' are considered as value passed to the handler
	@click = updateInfo:{{binding.info}}
	@mousedown = setState
	'.' stands for text nodes
	.Name: {{name}}&nJob: {{job}}
	>br
	'-' stands for standard mounting point
	-node1
	'.' after a tag name stands for class names for this tag
	>p.some.class.names
		'#' at the end of a tag name stands for the name of the node
		Mustaches after a dot will bind to 'class' automatically
		>span.{{emergency = emergency}}#notice_box
			.Notice: {{notice}}
		.some text
		-node2
		'+' stands for list mounting point
		+list1
```

For standalone eft parser see [eft-parser](https://github.com/ClassicOldSong/eft-parser).

## Run a test
```
$ git clone https://github.com/ClassicOldSong/ef.js.git
$ cd ef.js
$ npm install
$ npm run dev
```
Then you can test it out in the opening browser window.

## Build from source
```
$ git clone https://github.com/ClassicOldSong/ef.js.git
$ cd ef.js
$ npm install
$ npm run build
```
Then you can get the fresh-built `ef.min.js` in the `dist` folder.

**Note:** All debugging messages are disabled in the production version, but you can enable them using `localStorage.setItem('loglevel:ef', 'TRACE')`

## License
[MIT](http://cos.mit-license.org/)
