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

const resolve = ({ path, name, parentNode, subscriberNode, dataNode }) => {
	if (path.length > 0) {
		parentNode = resolveReactivePath(path, parentNode)
		subscriberNode = resolvePath(path, subscriberNode)
		dataNode = resolvePath(path, dataNode)
	}
	if (!subscriberNode[name]) subscriberNode[name] = []
	if (!dataNode[name]) dataNode[name] = ''
	return { parentNode, subscriberNode: subscriberNode[name], dataNode }
}

const resolveSubscriber = (path, subscriber) => {
	const pathArr = path.split('.')
	const name = pathArr.pop()
	return resolvePath(pathArr, subscriber)[name]
}

export { resolvePath, resolve, resolveSubscriber }
