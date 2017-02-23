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
							if (subscriberNode.value === value) return
							subscriberNode.value = value
							for (let j of subscriberNode) j(value)
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
						if (children[node.name] && children[node.name].value === value) return
						const fragment = document.createDocumentFragment()
						const parent = placeholder.parentNode

						// Identify types of original value and new value
						const oldValType = Object.prototype.toString.call(children[node.name])
						const newValType = Object.prototype.toString.call(value)

						// Remove the old element if updated
						if (children[node.name]) {
							if (oldValType === '[object Array]') {
								for (let j of children[node.name]) parent.removeChild(j.$element)
							} else parent.removeChild(children[node.name].$element)
						}

						// Attach new element
						if (newValType === '[object Array]') {
							for (let j of value) fragment.appendChild(j.$element)
						} else fragment.appendChild(value.$element)

						// Update stored value
						children[node.name] = value
						// Append to current component
						parent.insertBefore(fragment, placeholder.nextSibling)
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
