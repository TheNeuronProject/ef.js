import createElement from './element-creator.js'
import DOM from './dom-helper.js'
import ARR from './array-helper.js'
import defineArr from './dom-arr-helper.js'
import typeOf from './type-of.js'
import initBinding from './binding.js'
import { warnAttachment, warnParentNode } from '../debug.js'

const bindTextNode = ({node, state, subscriber, innerData, element}) => {
	// Data binding text node
	const textNode = document.createTextNode('')
	const handler = (value) => {
		textNode.textContent = value
	}
	initBinding({bind: node, state, subscriber, innerData, handler})

	// Append element to the component
	DOM.append(element, textNode)
}

const updateMountingNode = ({$element, children, name, anchor, value}) => {
	if (children[name] === value) return
	if (value) {
		if (value.$attached) warnAttachment(value)
		if (value.$element.contains($element)) return warnParentNode()
	}
	// Update component
	if (children[name]) DOM.remove(children[name].$element)
	if (value) DOM.after(anchor, value.$element)
	// Update stored value
	children[name] = value
}

const bindMountingNode = ({state, name, children, anchor}) => {
	Object.defineProperty(state, name, {
		get() {
			return children[name]
		},
		set(value) {
			updateMountingNode({$element: state.$element, children, name, anchor, value})
		},
		enumerable: true,
		configurable: true
	})
}

const updateMountingList = ({$element, children, name, anchor, value}) => {
	if (value) value = ARR.copy(value)
	else value = []
	const fragment = document.createDocumentFragment()
	// Update components
	if (children[name]) {
		for (let j of value) {
			if (j.$element.contains($element)) return warnParentNode()
			DOM.append(fragment, j.$element)
			ARR.remove(children[name], j)
		}
		for (let j of children[name]) DOM.remove(j.$element)
	} else for (let j of value) DOM.append(fragment, j.$element)
	// Update stored value
	children[name].length = 0
	ARR.push(children[name], ...value)
	// Append to current component
	DOM.after(anchor, fragment)
}

const bindMountingList = ({state, name, children, anchor}) => {
	children[name] = defineArr([], anchor)
	Object.defineProperty(state, name, {
		get() {
			return children[name]
		},
		set(value) {
			if (children[name] && ARR.equals(children[name], value)) return
			updateMountingList({$element: state.$element, children, name, anchor, value})
		},
		enumerable: true,
		configurable: true
	})
}

const resolveAST = ({node, nodeType, element, state, innerData, refs, children, subscriber, create}) => {
	switch (nodeType) {
		case 'string': {
			// Static text node
			DOM.append(element, document.createTextNode(node))
			break
		}
		case 'array': {
			if (typeOf(node[0]) === 'object') DOM.append(element, create({ast: node, state, innerData, refs, children, subscriber, create}))
			else bindTextNode({node, state, subscriber, innerData, element})
			break
		}
		case 'object': {
			const anchor = document.createTextNode('')
			if (node.t === 0) bindMountingNode({state, name: node.n, children, anchor})
			else if (node.t === 1) bindMountingList({state, name: node.n, children, anchor})
			else throw new TypeError(`Not a standard ef.js AST: Unknown mounting point type '${node.t}'`)
			// Append anchor
			DOM.append(element, anchor)
			// Display anchor indicator in development mode
			if (ENV !== 'production') {
				DOM.before(anchor, document.createComment(`Start of mounting point '${node.n}'`))
				DOM.after(anchor, document.createComment(`End of mounting point '${node.n}'`))
			}
			break
		}
		default: {
			throw new TypeError(`Not a standard ef.js AST: Unknown node type '${nodeType}'`)
		}
	}
}

const create = ({ast, state, innerData, refs, children, subscriber, create}) => {
	// First create an element according to the description
	const element = createElement({info: ast[0], state, innerData, refs, subscriber})

	// Append child nodes
	for (let i = 1; i < ast.length; i++) resolveAST({node: ast[i], nodeType: typeOf(ast[i]), element, state, innerData, refs, children, subscriber, create})

	return element
}

export default create
