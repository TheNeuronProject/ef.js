import createElement from './element-creator.js'
import resolve from './path-resolver.js'

const create = ({ ast, state, children, subscriber }) => {
	const element = createElement(ast[0], state, subscriber)

	for (let i = 1; i < ast.length; i++) {
		const node = ast[i]
		switch (Object.prototype.toString.call(node)) {
			case '[object String]': {
				element.appendChild(document.createTextNode(node))
				break
			}
			case '[object Array]': {
				if (Object.prototype.toString.call(node[0]) === '[object Object]') {
					// Create child element
					element.appendChild(create({ ast: node, state, children, subscriber }))
				} else if (Object.prototype.toString.call(node[0]) === '[object String]') {
					const name = node[node.length - 1]
					let parentNode = state.$data
					let sbuscriberNode = subscriber
					if (node.length - 1 > 0) {
						parentNode = resolve(node, parentNode)
						sbuscriberNode = resolve(node, sbuscriberNode)
					}
					const textNode = document.createTextNode('')
					sbuscriberNode[name] = sbuscriberNode[name] || []
					sbuscriberNode = sbuscriberNode[name]
					sbuscriberNode.value = sbuscriberNode.value || ''
					sbuscriberNode.push((value) => {
						textNode.textContent = value
					})
					if (typeof parentNode[name] === 'undefined') Object.defineProperty(parentNode, name, {
						get() {
							return sbuscriberNode.value
						},
						set(value) {
							sbuscriberNode.value = value
							for (let j = 0; j < sbuscriberNode.length; j++) sbuscriberNode[j](value)
						},
						enumerable: true
					})
					element.appendChild(textNode)
				}
				break
			}
			case '[object Object]': {
				const placeholder = document.createTextNode('')
				Object.defineProperty(state, node.name, {
					get() {
						return children[node.name]
					},
					set(value) {
						const parent = placeholder.parentNode
						// Remove the old element if updated
						if (children[node.name] && children[node.name].$element) parent.removeChild(children[node.name].$element)

						// Attach new element
						const sibling = placeholder.nextSibling
						children[node.name] = value.$render()
						parent.insertBefore(children[node.name].$element, sibling)
					},
					enumerable: true
				})
				element.appendChild(placeholder)
				break
			}
			default:
		}
	}

	return element
}

export default create
