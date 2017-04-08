const mixStr = (strs, ...exprs) => {
	let string = ''
	for (let i = 0; i < exprs.length; i++) string += (strs[i] + exprs[i])
	return string + strs[strs.length - 1]
}

export default mixStr
