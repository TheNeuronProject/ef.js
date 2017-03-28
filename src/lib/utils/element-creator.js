import { warn } from '../debug.js'
import typeOf from './type-of.js'
import initBinding from './binding.js'

const createElement = ({info, state, innerData, nodes, subscriber}) => {
	const element = document.createElement(info.tag)
	if (info.alias) Object.defineProperty(nodes, info.alias, {value: element})
	for (let i in info.attr) {
		const attr = info.attr[i]
		if (typeOf(attr) === 'string') element.setAttribute(i, attr)
		else {
			const handler = value => element.setAttribute(i, value)
			initBinding({bind: attr, state, subscriber, innerData, handler})
		}
	}
	for (let i in info.prop) {
		const prop = info.prop[i]
		if (typeOf(prop) === 'string') element[i] = prop
		else {
			const handler = (value) => {
				element[i] = value
			}
			const {dataNode, subscriberNode} = initBinding({bind: prop, state, subscriber, innerData, handler})

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
		const [method, value] = info.event[i]
		element.addEventListener(i, (e) => {
			if (state.$methods[method]) state.$methods[method]({e, value, state})
			else warn(`Method named '${method}' not found!`)
		}, false)
	}
	return element
}

export default createElement
