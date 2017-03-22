import { warn } from '../debug.js'
import typeOf from './type-of.js'
import initBinding from './binding.js'

const createElement = ({info, state, innerData, nodes, subscriber}) => {
	const element = document.createElement(info.tag)
	if (info.alias) nodes[info.alias] = element
	for (let i in info.attr) {
		const attr = info.attr[i]
		if (typeOf(attr) === 'string') element.setAttribute(i, attr)
		else {
			const handler = value => element.setAttribute(i, value)
			initBinding({path: attr, state, subscriber, innerData, handler})
		}
	}
	for (let i in info.prop) {
		const prop = info.prop[i]
		if (typeOf(prop) === 'string') element[i] = prop
		else {
			const handler = (value) => {
				element[i] = value
			}
			const {dataNode, subscriberNode} = initBinding({path: prop, state, subscriber, innerData, handler})

			if (i === 'value' || i === 'checked') {
				const updateOthers = (value) => {
					if (dataNode[name] === value) return
					dataNode[name] = value
					for (let j of subscriberNode) {
						if (j !== handler) j.call(state, value)
					}
				}
				if (i === 'value') {
					element.addEventListener('input', () => updateOthers(element.value), false)
					element.addEventListener('change', () => updateOthers(element.value), false)
				} else element.addEventListener('change', () => updateOthers(event.checked), false)
			}
		}
	}
	for (let i in info.event) {
		const method = info.event[i]
		element.addEventListener(i, (e) => {
			if (state.$methods[method]) state.$methods[method](state, e)
			else warn(`No method named '${method}' found!`)
		}, false)
	}
	return element
}

export default createElement
