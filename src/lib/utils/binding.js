import ARR from './array-helper.js'
import { resolve } from './resolver.js'

const initBinding = ({bind, state, subscriber, innerData, handler}) => {
	const path = ARR.copy(bind[0])
	const _default = bind[1]
	const _key = path.pop()
	const { parentNode, subscriberNode, dataNode } = resolve({
		path,
		_key,
		parentNode: state.$data,
		subscriberNode: subscriber,
		dataNode: innerData
	})
	if (typeof parentNode[_key] === 'undefined') {
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
	if (_default) {
		parentNode[_key] = _default
	}
	if (parentNode[_key]) handler(parentNode[_key])
	subscriberNode.push(handler)

	return {dataNode, subscriberNode, _key}
}

export default initBinding
