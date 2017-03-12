import { warn } from '../debug.js'
import { resolve } from './resolver.js'
import initSubscribe from './subscriber.js'

const createElement = (info, state, subscriber) => {
	const element = document.createElement(info.tag)
	for (let i in info.attr) {
		const attr = info.attr[i]
		if (typeof attr === 'string') element.setAttribute(i, attr)
		else {
			const name = attr.pop()
			const { parentNode, subscriberNode } = resolve({
				path: attr,
				name: name,
				parentNode: state.$data,
				subscriberNode: subscriber
			})
			subscriberNode.push((value) => {
				element.setAttribute(i, value)
			})
			initSubscribe({subscriberNode, parentNode, name, state})
		}
	}
	for (let i in info.prop) {
		const prop = info.prop[i]
		if (typeof prop === 'string') element[i] = prop
		else {
			const name = prop.pop()
			const { parentNode, subscriberNode } = resolve({
				path: prop,
				name: name,
				parentNode: state.$data,
				subscriberNode: subscriber
			})
			const handler = (value) => {
				element[i] = value
			}
			subscriberNode.push(handler)
			initSubscribe({subscriberNode, parentNode, name, state})

			if (typeof prop === 'object' && (i === 'value' || i === 'checked')) {
				const updateOthers = (value) => {
					if (subscriberNode.value === value) return
					subscriberNode.value = value
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
