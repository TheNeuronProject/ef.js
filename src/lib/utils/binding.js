import ARR from './array-helper.js'
import { resolve } from './resolver.js'

const initBinding = ({bind, state, subscriber, innerData, handler}) => {
	const [_path, _default] = bind
	const path = ARR.copy(_path)
	const name = path.pop()
	const { parentNode, subscriberNode, dataNode } = resolve({
		path,
		name,
		parentNode: state.$data,
		subscriberNode: subscriber,
		dataNode: innerData
	})
	if (typeof parentNode[name] === 'undefined') {
		Object.defineProperty(parentNode, name, {
			get() {
				return dataNode[name]
			},
			set(value) {
				if (dataNode[name] === value) return
				dataNode[name] = value
				for (let j of subscriberNode) j.call(state, value)
			},
			enumerable: true
		})
	}
	if (_default) {
		parentNode[name] = _default
	}
	if (parentNode[name]) handler(parentNode[name])
	subscriberNode.push(handler)

	return {dataNode, subscriberNode}
}

export default initBinding
