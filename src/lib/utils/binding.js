import { resolveDefault, resolve } from './resolver.js'

const initBinding = ({path, state, subscriber, innerData, handler}) => {
	const _default = resolveDefault(path)
	const name = path.pop()
	const { parentNode, subscriberNode, dataNode } = resolve({
		path: path,
		name: name,
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
	subscriberNode.push(handler)
	if (_default) parentNode[name] = _default

	return {dataNode, subscriberNode}
}

export default initBinding
