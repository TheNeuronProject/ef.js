import deepAssign from 'deep-assign'
import ARR from './array-helper.js'
import typeOf from './type-of.js'

// Resolve an array described path to an object
const resolvePath = (path, obj) => {
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

const resolve = ({ path, name, parentNode, subscriberNode }) => {
	if (path.length > 0) {
		parentNode = resolvePath(path, parentNode)
		subscriberNode = resolvePath(path, subscriberNode)
	}
	subscriberNode[name] = subscriberNode[name] || []
	subscriberNode = subscriberNode[name]
	subscriberNode.value = subscriberNode.value || ''
	return { parentNode, subscriberNode }
}

const resolveDefault = (path, defaults) => {
	// Check whether has default value
	if (typeOf(path[path.length - 1]) !== 'array') return

	const _default = path.pop()[0]
	const tmpPath = ARR.copy(path)
	const name = tmpPath.pop()
	const defaultNode = resolvePath(tmpPath, defaults)
	defaultNode[name] = _default
}

export { resolvePath, resolve, resolveDefault }
