import createElement from './element-creator.js'
import DOM from './dom-helper.js'
import ARR from './array-helper.js'
import defineArr from './dom-arr-helper.js'
import typeOf from './type-of.js'
import initBinding from './binding.js'
import { queue, inform, exec } from './render-query.js'

const bindTextNode = ({node, state, handlers, subscribers, innerData, element}) => {
	// Data binding text node
	const textNode = document.createTextNode('')
	const { dataNode, handlerNode, _key } = initBinding({bind: node, state, handlers, subscribers, innerData})
	const handler = () => {
		textNode.textContent = dataNode[_key]
	}
	handlerNode.push(handler)
	queue([handler])

	// Append element to the component
	DOM.append(element, textNode)
}

const updateMountingNode = ({state, children, key, anchor, value}) => {
	if (children[key] === value) return
	if (value) {
		if (value.$parent && ENV !== 'production') console.warn('[EF]', 'Better detach the component before attaching it to a new component!')
		if (value.$element.contains(state.$element)) {
			if (ENV !== 'production') console.warn('[EF]', 'Cannot mount a component to it\'s child component!')
			return
		}
	}

	inform()
	// Update component
	if (children[key]) children[key].$umount()
	// Update stored value
	children[key] = value
	if (value) value.$mount({target: anchor, parent: state, option: 'before', key})
	exec()
}

const bindMountingNode = ({state, key, children, anchor}) => {
	Object.defineProperty(state, key, {
		get() {
			return children[key]
		},
		set(value) {
			updateMountingNode({state, children, key, anchor, value})
		},
		enumerable: true,
		configurable: true
	})
}

const updateMountingList = ({state, children, key, anchor, value}) => {
	if (value) value = ARR.copy(value)
	else value = []
	const fragment = document.createDocumentFragment()
	// Update components
	inform()
	if (children[key]) {
		for (let j of value) {
			if (j.$element.contains(state.$element)) {
				if (ENV !== 'production') console.warn('[EF]', 'Cannot mount a component to it\'s child component!')
				return
			}
			j.$umount()
			DOM.append(fragment, j.$mount({parent: state, key}))
		}
		for (let j of ARR.copy(children[key])) j.$umount()
	} else for (let j of value) DOM.append(fragment, j.$mount({parent: state, key}))
	// Update stored value
	children[key].length = 0
	ARR.push(children[key], ...value)
	// Append to current component
	DOM.after(anchor, fragment)
	exec()
}

const bindMountingList = ({state, key, children, anchor}) => {
	children[key] = defineArr([], {state, key, anchor})
	Object.defineProperty(state, key, {
		get() {
			return children[key]
		},
		set(value) {
			if (children[key] && ARR.equals(children[key], value)) return
			updateMountingList({state, children, key, anchor, value})
		},
		enumerable: true,
		configurable: true
	})
}

const resolveAST = ({node, nodeType, element, state, innerData, refs, children, handlers, subscribers, svg, create}) => {
	switch (nodeType) {
		case 'string': {
			// Static text node
			DOM.append(element, document.createTextNode(node))
			break
		}
		case 'array': {
			if (typeOf(node[0]) === 'object') DOM.append(element, create({node, state, innerData, refs, children, handlers, subscribers, svg, create}))
			else bindTextNode({node, state, handlers, subscribers, innerData, element})
			break
		}
		case 'object': {
			const anchor = document.createTextNode('')
			if (node.t === 0) bindMountingNode({state, key: node.n, children, anchor})
			else if (node.t === 1) bindMountingList({state, key: node.n, children, anchor})
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

const create = ({node, state, innerData, refs, children, handlers, subscribers, svg, create}) => {
	const [info, ...childNodes] = node
	if (!svg && info.t === 'svg') svg = true
	// First create an element according to the description
	const element = createElement({info, state, innerData, refs, handlers, subscribers, svg})

	// Append child nodes
	for (let i = 0; i < childNodes.length; i++) resolveAST({node: childNodes[i], nodeType: typeOf(childNodes[i]), element, state, innerData, refs, children, handlers, subscribers, svg, create})

	return element
}

export default create
