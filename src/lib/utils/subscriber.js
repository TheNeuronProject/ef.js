const subscribe = ({subscriberNode, parentNode, name, state}) => {
	if (typeof parentNode[name] === 'undefined') {
		subscriberNode.value = ''
		Object.defineProperty(parentNode, name, {
			get() {
				return subscriberNode.value
			},
			set(value) {
				if (subscriberNode.value === value) return
				subscriberNode.value = value
				for (let j of subscriberNode) j.call(state, value)
			},
			enumerable: true
		})
	}
}

export default subscribe
