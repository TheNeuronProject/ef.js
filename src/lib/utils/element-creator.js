import resolve from './path-resolver.js'

const createElement = (info, state) => {
	const element = document.createElement(info.tag)
	for (let i in info.attr) {
		const attr = info.attr[i]
		if (typeof attr === 'string') element.setAttribute(i, attr)
		else {
			const name = attr[attr.length - 1]
			let parentNode = state.$data
			if (attr.length - 1 > 0) parentNode = resolve(attr, state.$data, attr.length - 1)
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
	for (let i in info.event) {
		const method = info.event[i]
		element.addEventListener(i, () => state.$methods[method](), false)
	}
	return element
}

export default createElement
