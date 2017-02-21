import createElement from './element-creator.js'
import resolve from './path-resolver.js'

const create = (ast, state) => {
	const element = createElement(ast[0], state)
	const children = {}

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
					element.appendChild(create(node, state))
				} else if (Object.prototype.toString.call(node[0]) === '[object String]') {
					const name = node[node.length - 1]
					let parentNode = state.$data
					if (node.length - 1 > 0) parentNode = resolve(node, state.$data)
					const textNode = document.createTextNode('')
					Object.defineProperty(parentNode, name, {
						get() {
							return textNode.textContent
						},
						set(value) {
							textNode.textContent = value
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
