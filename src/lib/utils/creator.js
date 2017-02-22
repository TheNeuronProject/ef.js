import createElement from './element-creator.js'
import resolve from './resolver.js'

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
					const textNode = document.createTextNode('')
					const { parentNode, subscriberNode } = resolve({
						arr: node,
						name: name,
						parentNode: state.$data,
						subscriberNode: subscriber
					})
					subscriberNode.push((value) => {
						textNode.textContent = value
					})
					if (typeof parentNode[name] === 'undefined') Object.defineProperty(parentNode, name, {
						get() {
							return subscriberNode.value
						},
						set(value) {
							subscriberNode.value = value
							for (let j = 0; j < subscriberNode.length; j++) subscriberNode[j](value)
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
						children[node.name] = value
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
