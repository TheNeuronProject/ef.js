import { warn } from '../../debug.js'
import resolve from './resolver.js'

const createElement = (info, state, subscriber) => {
	const element = document.createElement(info.tag)
	for (let i in info.attr) {
		const attr = info.attr[i]
		if (typeof attr === 'string') element.setAttribute(i, attr)
		else {
			const name = attr[attr.length - 1]
			const { parentNode, subscriberNode } = resolve({
				arr: attr,
				name: name,
				parentNode: state.$data,
				subscriberNode: subscriber
			})
			subscriberNode.push((value) => {
				element.setAttribute(i, value)
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
		}
	}
	for (let i in info.prop) {
		const prop = info.prop[i]
		if (typeof attr === 'string') element[i] = prop
		else {
			const name = prop[prop.length - 1]
			const { parentNode, subscriberNode } = resolve({
				arr: prop,
				name: name,
				parentNode: state.$data,
				subscriberNode: subscriber
			})
			subscriberNode.push((value) => {
				element[i] = value
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
		}
	}
	for (let i in info.event) {
		const method = info.event[i]
		element.addEventListener(i, () => {
			if (state.$methods[method]) state.$methods[method](state)
			else warn(`No method named "${method}" found!`)
		}, false)
	}
	return element
}

export default createElement
