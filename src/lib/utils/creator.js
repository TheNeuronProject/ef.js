import createElement from './element-creator.js'
import DOM from './dom-helper.js'
import ARR from './array-helper.js'
import { DOMARR, _placeHolder } from './dom-arr-helper.js'
import { resolve } from './resolver.js'
import subscribe from './subscriber.js'
import { warnAttachment } from '../debug.js'

const create = ({ ast, state, children, subscriber }) => {
	// First create an element according to the description
	const element = createElement(ast[0], state, subscriber)

	// Append child nodes
	for (let i = 1; i < ast.length; i++) {
		const node = ast[i]
		const nodeType = Object.prototype.toString.call(node)
		switch (nodeType) {
			case '[object String]': {
				// Static text node
				DOM.append(element, document.createTextNode(node))
				break
			}
			case '[object Array]': {
				if (Object.prototype.toString.call(node[0]) === '[object Object]') {
					// Create child element
					DOM.append(element, create({ ast: node, state, children, subscriber }))
				} else if (Object.prototype.toString.call(node[0]) === '[object String]') {
					// Data binding text node
					const name = node[node.length - 1]
					const textNode = document.createTextNode('')
					const { parentNode, subscriberNode } = resolve({
						path: node,
						name: name,
						parentNode: state.$data,
						subscriberNode: subscriber
					})
					// Subscribe value changing
					subscriberNode.push((value) => {
						textNode.textContent = value
					})
					// Bind operating methods if not exist
					subscribe({subscriberNode, parentNode, name, state})
					DOM.append(element, textNode)
				}
				break
			}
			case '[object Object]': {
				const placeholder = (() => {
					if (ENV === 'production') return document.createTextNode('')
					return document.createComment(`Mounting point for '${node.name}'`)
				})()
				if (node.type === 'node') {
					Object.defineProperty(state, node.name, {
						get() {
							return children[node.name]
						},
						set(value) {
							if (children[node.name] && children[node.name].value === value) return
							if (value.$attached) return warnAttachment(value)
							// Update component
							if (children[node.name]) DOM.remove(children[node.name].$element)
							DOM.after(placeholder, value.$element)
							// Update stored value
							children[node.name] = value
						},
						enumerable: true
					})
				} else if (node.type === 'list') {
					const initArr = Object.assign([], DOMARR)
					_placeHolder.set(initArr, placeholder)
					children[node.name] = initArr
					Object.defineProperty(state, node.name, {
						get() {
							return children[node.name]
						},
						set(value) {
							if (children[node.name] && children[node.name].value === value) return
							_placeHolder.set(value, placeholder)
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
							children[node.name] = Object.assign(value, DOMARR)
							// Append to current component
							DOM.after(placeholder, fragment)
						},
						enumerable: true
					})
				} else throw new TypeError(`Not a standard ef.js AST: Unknown mounting point type '${node.type}'`)
				// Append placeholder
				DOM.append(element, placeholder)
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
