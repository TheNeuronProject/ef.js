import deepAssign from 'deep-assign'

// Resolve an array described path to an object
const resolvePath = (path, obj) => {
	for (let i = 0; i < path.length - 1; i++) {
		const name = path[i]
		if (!obj[name]) {
			const node = {}
			Object.defineProperty(obj, name, {
				get() {
					return node
				},
				set(data) {
					deepAssign(node, data)
				},
				enumerable: true
			})
		}
		obj = obj[name]
	}
	return obj
}

const resolve = ({ path, name, parentNode, subscriberNode }) => {
	if (path.length - 1 > 0) {
		parentNode = resolvePath(path, parentNode)
		subscriberNode = resolvePath(path, subscriberNode)
	}
	subscriberNode[name] = subscriberNode[name] || []
	subscriberNode = subscriberNode[name]
	subscriberNode.value = subscriberNode.value || null
	return { parentNode, subscriberNode }
}

export { resolvePath, resolve }
