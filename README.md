# ef.js
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/ClassicOldSong/ef.js/master/LICENSE) [![npm](https://img.shields.io/npm/dt/ef.js.svg?style=flat-square)](https://www.npmjs.com/package/ef.js) [![Build status](https://img.shields.io/travis/ClassicOldSong/ef.js.svg?style=flat-square)](https://travis-ci.org/ClassicOldSong/ef.js)

(maybe) An elegent HTML template framework

## Usage
``` javascript
import ef from 'ef.js'

const template = 'Your awsome template'
const ast = [/* AST parsed by eft-parser */]
const data1 = {
	$data: {/* Binding data */}
	$methods: {/* Binding methods */}
}
const data2 = {
	$data: {/* Binding data */}
	$methods: {/* Binding methods */}
}

const module1 = new ef(template)
const module2 = new ef(ast)

const component1 = module1.render(data1)
const component2 = module2.render(data2)

component1.$data.something = 'something new' // Update the binding data 'something'
component2.$methods.someMethod = (state, e) => {
	state.$data.something = 'something new'
	console.log('Event target', e.target)
} // Update binding method

const logData = val => console.log('Subscribed data updated:', val
component1.$subscribe('info.data', logData) // Observe a value
component2.$unsubscribe('info.data', logData) // Stop observing a value

component1.$update(data) // Update the whole component state
component2.$attached // Check if the component has mounted to something

component1.mountingPoint = component2 // Mount component2 to 'mountingPoint' on component1
component1.mountingPoint = null // Detach the mounted component

component1.listMP.push(componet2) // Mount component2 to list 'listMP' mounting point on component1

```

## Template format
ef.js template is **very srtict to indents**. Only tabs are allowed. Wrong indents could lead to a parsing error.

Here is an example template.

``` javascript
Tree structure
Lines not started with >#%@.+- are considered as comments
this is a comment
'>' stands for tag name
>div
	'#' stands for attributes
	#class = {{class}}
	#style = {{attr.style}}
	#id = testdiv
	#some-attr = some text
	#content =
	'%' stands for properties
	%title = {{name}}
	%anotherProperty = text
	%contentEditable = {{edit}}
	'@' stands for events
	@click = updateInfo
	@mousedown = setState
	'.' stands for text nodes
	.Name: {{name}}&nJob: {{job}}
	>br
	'-' stands for standard mounting point
	-node1
	>p
		#class = some class names
		>span
			.Notice: {{notice}}
		.some text
		-node2
		'+' stands for list mounting point
		+list1
```

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
Then you can get the fresh-built `ef.min.js` at the `dist` folder.

**Note:** All debugging messages are disabled in the production version

## License
[MIT](http://cos.mit-license.org/)
