import deepAssign from 'deep-assign'
import typeOf from './type-of.js'

// Resolve an array described path to an object
const resolvePath = (path, obj) => {
	for (let i of path) obj = obj[i] || {}
	return obj
}

const resolveReactivePath = (path, obj) => {
	for (let i of path) {
		if (!obj[i]) {
			const node = {}
			Object.defineProperty(obj, i, {
				get() {
					return node
				},
				set(data) {
					deepAssign(node, data)
				},
				enumerable: true
			})
		}
		obj = obj[i]
	}
	return obj
}

const resolve = ({ path, name, parentNode, subscriberNode, dataNode }) => {
	if (path.length > 0) {
		parentNode = resolveReactivePath(path, parentNode)
		subscriberNode = resolvePath(path, subscriberNode)
		dataNode = resolvePath(path, dataNode)
	}
	subscriberNode[name] = subscriberNode[name] || []
	subscriberNode = subscriberNode[name]
	dataNode[name] = dataNode[name] || ''
	return { parentNode, subscriberNode, dataNode }
}

const resolveDefault = (path) => {
	// Check whether has default value
	if (typeOf(path[path.length - 1]) !== 'array') return
	const _default = path.pop()[0]
	return _default
}

const resolveSubscriber = (path, subscriber) => {
	const pathArr = path.split('.')
	const name = pathArr.pop()
	return resolvePath(pathArr, subscriber)[name]
}

export { resolvePath, resolve, resolveDefault, resolveSubscriber }
