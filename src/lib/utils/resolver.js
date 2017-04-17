import deepAssign from 'deep-assign'

// Resolve an array described path to an object
const resolvePath = (_path, obj) => {
	for (let i of _path) {
		if (!obj[i]) obj[i] = {}
		obj = obj[i]
	}
	return obj
}

const resolveReactivePath = (_path, obj) => {
	for (let i of _path) {
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

const resolve = ({ _path, _key, parentNode, subscriberNode, dataNode }) => {
	if (_path.length > 0) {
		parentNode = resolveReactivePath(_path, parentNode)
		subscriberNode = resolvePath(_path, subscriberNode)
		dataNode = resolvePath(_path, dataNode)
	}
	if (!subscriberNode[_key]) subscriberNode[_key] = []
	if (!Object.prototype.hasOwnProperty.call(dataNode, _key)) dataNode[_key] = ''
	return { parentNode, subscriberNode: subscriberNode[_key], dataNode }
}

const resolveSubscriber = (_path, subscriber) => {
	const pathArr = _path.split('.')
	const key = pathArr.pop()
	return resolvePath(pathArr, subscriber)[key]
}

export { resolvePath, resolve, resolveSubscriber }
