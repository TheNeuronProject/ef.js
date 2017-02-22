// Resolve an array described path to an object
const resolve = (arr, obj) => {
	for (let i = 0; i < arr.length - 1; i++) {
		const name = arr[i]
		obj[name] = obj[name] || {}
		obj = obj[name]
	}
	return obj
}

export default resolve
