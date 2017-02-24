// Resolve an array described path to an object
const resolvePath = (arr, obj) => {
	for (let i = 0; i < arr.length - 1; i++) {
		const name = arr[i]
		if (!obj[name]) Object.defineProperty(obj, name, {
			value: {},
			enumerable: true
		})
		obj = obj[name]
	}
	return obj
}

const resolve = ({ arr, name, parentNode, subscriberNode }) => {
	if (arr.length - 1 > 0) {
		parentNode = resolvePath(arr, parentNode)
		subscriberNode = resolvePath(arr, subscriberNode)
	}
	subscriberNode[name] = subscriberNode[name] || []
	subscriberNode = subscriberNode[name]
	subscriberNode.value = subscriberNode.value || null
	return { parentNode, subscriberNode }
}

export default resolve
