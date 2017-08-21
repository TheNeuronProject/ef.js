import { assign } from './polyfills.js'
import { inform, exec } from './render-query.js'

const resolveAllPath = ({_path, handlers, subscribers, innerData}) => {
	for (let i of _path) {
		if (!handlers[i]) handlers[i] = {}
		if (!subscribers[i]) subscribers[i] = {}
		if (!innerData[i]) innerData[i] = {}
		handlers = handlers[i]
		subscribers = subscribers[i]
		innerData = innerData[i]
	}
	return {
		handlerNode: handlers,
		subscriberNode: subscribers,
		dataNode: innerData
	}
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

const resolve = ({ _path, _key, data, handlers, subscribers, innerData }) => {
	const parentNode = resolveReactivePath(_path, data, true)
	const {handlerNode, subscriberNode, dataNode} = resolveAllPath({_path, handlers, subscribers, innerData})
	if (!handlerNode[_key]) handlerNode[_key] = []
	if (!subscriberNode[_key]) subscriberNode[_key] = []
	if (!Object.prototype.hasOwnProperty.call(dataNode, _key)) dataNode[_key] = ''
	return { parentNode, handlerNode: handlerNode[_key], subscriberNode: subscriberNode[_key], dataNode }
}

const resolveSubscriber = (_path, subscribers) => {
	const pathArr = _path.split('.')
	const key = pathArr.pop()
	for (let i of pathArr) {
		if (!subscribers[i]) subscribers[i] = {}
		subscribers = subscribers[i]
	}
	return subscribers[key]
}

export { resolveReactivePath, resolve, resolveSubscriber }
