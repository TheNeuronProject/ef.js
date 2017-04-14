import ARR from './array-helper.js'
import { resolve } from './resolver.js'

const initDataNode = ({parentNode, dataNode, subscriberNode, state, _key}) => {
	Object.defineProperty(parentNode, _key, {
		get() {
			return dataNode[_key]
		},
		set(value) {
			if (dataNode[_key] === value) return
			dataNode[_key] = value
			for (let j of subscriberNode) j.call(state, value)
		},
		enumerable: true
	})
}

const initBinding = ({bind, state, subscriber, innerData, handler}) => {
	const _path = ARR.copy(bind[0])
	const _default = bind[1]
	const _key = _path.pop()
	const { parentNode, subscriberNode, dataNode } = resolve({
		_path,
		_key,
		parentNode: state.$data,
		subscriberNode: subscriber,
		dataNode: innerData
	})

	// Initlize data binding node if not exist
	if (!Object.hasOwnProperty.call(parentNode, _key)) initDataNode({parentNode, dataNode, subscriberNode, state, _key})
	// Update default value
	if (_default) parentNode[_key] = _default

	if (handler) {
		handler(dataNode[_key])
		subscriberNode.push(handler)
	}

	return {dataNode, subscriberNode, _key}
}

export default initBinding
