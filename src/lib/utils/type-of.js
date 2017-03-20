const typeOf = (obj) => {
	const type = Object.prototype.toString.call(obj).split(' ')[1]
	return type.substr(0, type.length - 1).toLowerCase()
}

export default typeOf
