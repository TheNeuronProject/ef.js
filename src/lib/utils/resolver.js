import deepAssign from 'deep-assign'

// Resolve an array described path to an object
const resolvePath = (path, obj) => {
	for (let i of path) {
		if (!obj[i]) obj[i] = {}
		obj = obj[i]
	}
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

const resolve = ({ path, _key, parentNode, subscriberNode, dataNode }) => {
	if (path.length > 0) {
		parentNode = resolveReactivePath(path, parentNode)
		subscriberNode = resolvePath(path, subscriberNode)
		dataNode = resolvePath(path, dataNode)
	}
	if (!subscriberNode[_key]) subscriberNode[_key] = []
	if (!dataNode[_key]) dataNode[_key] = ''
	return { parentNode, subscriberNode: subscriberNode[_key], dataNode }
}

const resolveSubscriber = (path, subscriber) => {
	const pathArr = path.split('.')
	const key = pathArr.pop()
	return resolvePath(pathArr, subscriber)[key]
}

export { resolvePath, resolve, resolveSubscriber }
