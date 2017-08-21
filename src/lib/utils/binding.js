import ARR from './array-helper.js'
import { resolve } from './resolver.js'
import { queue, inform, exec } from './render-query.js'

const initDataNode = ({parentNode, dataNode, handlerNode, subscriberNode, state, _key}) => {
	Object.defineProperty(parentNode, _key, {
		get() {
			return dataNode[_key]
		},
		set(value) {
			if (dataNode[_key] === value) return
			dataNode[_key] = value
			queue(handlerNode)
			inform()
			for (let j of subscriberNode) j({state, value})
			exec()
		},
		enumerable: true
	})
}

const initBinding = ({bind, state, handlers, subscribers, innerData}) => {
	const _path = ARR.copy(bind[0])
	const _default = bind[1]
	const _key = _path.pop()
	const { parentNode, handlerNode, subscriberNode, dataNode } = resolve({
		_path,
		_key,
		data: state.$data,
		handlers,
		subscribers,
		innerData
	})

	// Initlize data binding node if not exist
	if (!Object.prototype.hasOwnProperty.call(parentNode, _key)) initDataNode({parentNode, dataNode, handlerNode, subscriberNode, state, _key})
	// Update default value
	if (_default) parentNode[_key] = _default

	return {dataNode, handlerNode, subscriberNode, _key}
}

export default initBinding
