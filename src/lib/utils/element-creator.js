import { warn } from '../../debug.js'
import resolve from './path-resolver.js'

const createElement = (info, state, subscriber) => {
	const element = document.createElement(info.tag)
	for (let i in info.attr) {
		const attr = info.attr[i]
		if (typeof attr === 'string') element.setAttribute(i, attr)
		else {
			const name = attr[attr.length - 1]
			let parentNode = state.$data
			let sbuscriberNode = subscriber
			if (attr.length - 1 > 0) {
				parentNode = resolve(attr, parentNode)
				sbuscriberNode = resolve(attr, sbuscriberNode)
			}
			sbuscriberNode[name] = sbuscriberNode[name] || []
			sbuscriberNode = sbuscriberNode[name]
			sbuscriberNode.value = sbuscriberNode.value || ''
			sbuscriberNode.push((value) => {
				element.setAttribute(i, value)
			})
			if (typeof parentNode[name] === 'undefined') Object.defineProperty(parentNode, name, {
				get() {
					return sbuscriberNode.value
				},
				set(value) {
					sbuscriberNode.value = value
					for (let j = 0; j < sbuscriberNode.length; j++) sbuscriberNode[j](value)
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
			let sbuscriberNode = subscriber
			if (prop.length - 1 > 0) {
				parentNode = resolve(prop, parentNode)
				sbuscriberNode = resolve(prop, sbuscriberNode)
			}
			sbuscriberNode[name] = sbuscriberNode[name] || []
			sbuscriberNode = sbuscriberNode[name]
			sbuscriberNode.value = sbuscriberNode.value || ''
			sbuscriberNode.push((value) => {
				element[i] = value
			})
			if (typeof parentNode[name] === 'undefined') Object.defineProperty(parentNode, name, {
				get() {
					return sbuscriberNode.value
				},
				set(value) {
					sbuscriberNode.value = value
					for (let j = 0; j < sbuscriberNode.length; j++) sbuscriberNode[j](value)
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
