// Tree structure
// Lines not started with >#%@.+- are considered as comments
// this is a comment
// '>' stands for tag name
// >div
// 	'#' stands for attributes
// 	#class = {{class}}
// 	#style = {{attr.style}}
// 	#id = testdiv
// 	#some-attr = some text
// 	#content =
// 	'%' stands for properties
// 	%title = {{name}}
// 	%anotherProperty = text
// 	%contentEditable = {{edit}}
// 	'@' stands for events
// 	@click = updateInfo
// 	@mousedown = setState
// 	'.' stands for text nodes
// 	.Name: {{name}}&nJob: {{job}}
// 	>br
// 	'-' stands for standard mounting point
// 	-node1
// 	>p
// 		#class = some class names
// 		>span
// 			.Notice: {{notice}}
// 		.some text
// 		-node2
// 		'+' stands for list mounting point
// 		+list1

import eftParser from './utils/eft-parser.js'

const parse = (template, parser) => {
	if (!parser) parser = eftParser
	return parser(template)
}

window.parse = parse

export default parse
