import { warn } from '../../debug.js'
import resolve from './path-resolver.js'

const createElement = (info, state) => {
	const element = document.createElement(info.tag)
	for (let i in info.attr) {
		const attr = info.attr[i]
		if (typeof attr === 'string') element.setAttribute(i, attr)
		else {
			const name = attr[attr.length - 1]
			let parentNode = state.$data
			if (attr.length - 1 > 0) parentNode = resolve(attr, state.$data)
			Object.defineProperty(parentNode, name, {
				get() {
					return element.getAttribute(i)
				},
				set(value) {
					element.setAttribute(i, value)
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
			let parentNode = state.$data
			if (prop.length - 1 > 0) parentNode = resolve(prop, state.$data)
			Object.defineProperty(parentNode, name, {
				get() {
					return element[i]
				},
				set(value) {
					element[i] = value
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
