import deepAssign from 'deep-assign'

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

export { resolvePath, resolve }
