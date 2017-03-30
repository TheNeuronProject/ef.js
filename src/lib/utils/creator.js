import createElement from './element-creator.js'
import DOM from './dom-helper.js'
import ARR from './array-helper.js'
import defineArr from './dom-arr-helper.js'
import typeOf from './type-of.js'
import initBinding from './binding.js'
import { warn, warnAttachment } from '../debug.js'

// Reserved names
const reserved = 'attached data element nodes methods subscribe unsubscribe update destroy'.split(' ').map(i => `$${i}`)

const create = ({ast, state, innerData, nodes, children, subscriber}) => {
	// First create an element according to the description
	const element = createElement({info: ast[0], state, innerData, nodes, subscriber})

	// Append child nodes
	for (let i = 1; i < ast.length; i++) {
		const node = ast[i]
		const nodeType = typeOf(node)
		switch (nodeType) {
			case 'string': {
				// Static text node
				DOM.append(element, document.createTextNode(node))
				break
			}
			case 'array': {
				if (typeOf(node[0]) === 'object') {
					// Create child element
					DOM.append(element, create({ast: node, state, innerData, nodes, children, subscriber}))
				} else {
					// Data binding text node
					const textNode = document.createTextNode('')
					const handler = (value) => {
						textNode.textContent = value
					}
					initBinding({bind: node, state, subscriber, innerData, handler})

					// Append element to the component
					DOM.append(element, textNode)
				}
				break
			}
			case 'object': {
				if (reserved.indexOf(node.name) !== -1) {
					warn(`No reserved name '${node.name}' should be used, ignoring.`)
					break
				}
				const anchor = (() => {
					if (ENV === 'production') return document.createTextNode('')
					return document.createComment(`Mounting point for '${node.name}'`)
				})()
				if (node.type === 'node') {
					Object.defineProperty(state, node.name, {
						get() {
							return children[node.name]
						},
						set(value) {
							if (children[node.name] === value) return
							if (value && value.$attached) return warnAttachment(value)
							// Update component
							if (children[node.name]) DOM.remove(children[node.name].$element)
							if (value) DOM.after(anchor, value.$element)
							// Update stored value
							children[node.name] = value
						},
						enumerable: true,
						configurable: true
					})
				} else if (node.type === 'list') {
					const initArr = defineArr([], anchor)
					children[node.name] = initArr
					Object.defineProperty(state, node.name, {
						get() {
							return children[node.name]
						},
						set(value) {
							if (children[node.name] && ARR.equals(children[node.name], value)) return
							if (value) value = ARR.copy(value)
							else value = []
							const fragment = document.createDocumentFragment()
							// Update components
							if (children[node.name]) {
								for (let j of value) {
									if (j.$attached) return warnAttachment(j)
									DOM.append(fragment, j.$element)
									ARR.remove(children[node.name], j)
								}
								for (let j of children[node.name]) DOM.remove(j.$element)
							} else for (let j of value) DOM.append(fragment, j.$element)
							// Update stored value
							children[node.name].length = 0
							ARR.push(children[node.name], ...value)
							// Append to current component
							DOM.after(anchor, fragment)
						},
						enumerable: true,
						configurable: true
					})
				} else throw new TypeError(`Not a standard ef.js AST: Unknown mounting point type '${node.type}'`)
				// Append placeholder
				DOM.append(element, anchor)
				break
			}
			default: {
				throw new TypeError(`Not a standard ef.js AST: Unknown node type '${nodeType}'`)
			}
		}
	}

	return element
}

export default create
