import { assign } from './polyfills.js'
import { inform, exec } from './render-query.js'

// Resolve an array described path to an object
const resolvePath = (_path, obj) => {
	for (let i of _path) {
		if (!obj[i]) obj[i] = {}
		obj = obj[i]
	}
	return obj
}

const resolveReactivePath = (_path, obj, enume) => {
	for (let i of _path) {
		if (!obj[i]) {
			const node = {}
			Object.defineProperty(obj, i, {
				get() {
					return node
				},
				set(data) {
					inform()
					assign(node, data)
					exec()
				},
				configurable: !enume,
				enumerable: enume
			})
		}
		obj = obj[i]
	}
	return obj
}

const resolve = ({ _path, _key, parentNode, handlerNode, subscriberNode, dataNode }) => {
	if (_path.length > 0) {
		parentNode = resolveReactivePath(_path, parentNode, true)
		handlerNode = resolvePath(_path, handlerNode)
		subscriberNode = resolvePath(_path, subscriberNode)
		dataNode = resolvePath(_path, dataNode)
	}
	if (!handlerNode[_key]) handlerNode[_key] = []
	if (!subscriberNode[_key]) subscriberNode[_key] = []
	if (!Object.prototype.hasOwnProperty.call(dataNode, _key)) dataNode[_key] = ''
	return { parentNode, handlerNode: handlerNode[_key], subscriberNode: subscriberNode[_key], dataNode }
}

const resolveSubscriber = (_path, subscribers) => {
	const pathArr = _path.split('.')
	const key = pathArr.pop()
	return resolvePath(pathArr, subscribers)[key]
}

export { resolvePath, resolveReactivePath, resolve, resolveSubscriber }
