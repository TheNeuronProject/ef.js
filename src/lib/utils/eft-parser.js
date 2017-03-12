import ESCAPE from './escape-parser.js'

const typeSymbols = '>#%@.-+'.split('')
const fullMustache = /^\{\{.*\}\}$/
const mustache = /\{\{.+?\}\}/g

const getDepth = (string) => {
	let depth = 0
	const content = string = string.replace(/^\t+/, (str) => {
		depth = str.length
		return ''
	})
	return { depth, content }
}

const resolveDepth = (ast, depth) => {
	let currentNode = ast
	for (let i = 0; i < depth; i++) currentNode = currentNode[currentNode.length - 1]
	return currentNode
}

const parseNodeProps = (string) => {
	const splited = string.split('=')
	const name = splited.shift().trim()
	let value = splited.join('=').trim()
	if (fullMustache.test(value)) return { name, value: value.substr(2, value.length - 4).split('.') }
	return { name, value }
}

const parseText = (string) => {
	const parts = []
	const mustaches = string.match(mustache)
	if (mustaches) {
		const texts = string.split(mustache)
		for (let i = 0; i < texts.length; i++) {
			if (texts[i]) parts.push(ESCAPE(texts[i]))
			if (mustaches[i]) parts.push(mustaches[i].substr(2, mustaches[i].length - 4)
				.trim()
				.split('.'))
		}
	} else parts.push(string)
	return parts
}

const eftParser = (template) => {
	const lines = template.split(/[\r\n]/)
	const ast = []
	let prevDepth = 0
	let prevType = 'comment'
	let currentNode = ast
	let topExists = false
	for (let i in lines) {
		let { depth, content } = getDepth(lines[i])

		if (content) {
			if (depth < 0 || depth - prevDepth > 1 || (depth - prevDepth === 1 && ['comment', 'tag'].indexOf(prevType) === -1) || (depth === 0 && topExists)) throw new SyntaxError(`Bad indent at line ${parseInt(i, 10) + 1}`)
			const type = content[0]
			content = content.slice(1)
			if (!content && typeSymbols.indexOf(type) >= 0) throw new SyntaxError(`Empty content at line ${parseInt(i, 10) + 1}`)
			// Jump back to parent
			if (depth < prevDepth || (depth === prevDepth && prevType === 'tag')) currentNode = resolveDepth(ast, depth)
			prevDepth = depth

			switch (type) {
				case '>': {
					topExists = true
					prevType = 'tag'
					const newNode = [{
						tag: content,
						attr: {},
						prop: {},
						event: {}
					}]
					currentNode.push(newNode)
					currentNode = newNode
					break
				}
				case '#': {
					prevType = 'attr'
					const { name, value } = parseNodeProps(content)
					currentNode[0].attr[name] = value
					break
				}
				case '%': {
					prevType = 'prop'
					const { name, value } = parseNodeProps(content)
					currentNode[0].prop[name] = value
					break
				}
				case '@': {
					prevType = 'event'
					const { name, value } = parseNodeProps(content)
					if (typeof value !== 'string') throw new SyntaxError(`Methods should not be wrapped in mustaches. At line ${parseInt(i, 10) + 1}`)
					currentNode[0].event[name] = value
					break
				}
				case '.': {
					prevType = 'text'
					const parts = parseText(content)
					currentNode.push(...parts)
					break
				}
				case '-': {
					prevType = 'node'
					currentNode.push({
						name: content,
						type: 'node'
					})
					break
				}
				case '+': {
					prevType = 'list'
					currentNode.push({
						name: content,
						type: 'list'
					})
					break
				}
				default: {
					prevType = 'comment'
				}
			}
		}
	}

	if (ast[0]) return ast[0]
	throw new Error('Nothing to be parsed.')
}

export default eftParser
