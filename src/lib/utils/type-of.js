const typeOf = (obj) => {
	if (Array.isArray(obj)) return 'array'
	return typeof obj
}

export default typeOf
