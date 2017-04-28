import ARR from './array-helper.js'

const query = []
let count = 0

const queue = handlers => query.push(...handlers)

const inform = () => {
	count += 1
	return count
}

const exec = () => {
	if ((count -= 1) > 0) return false
	count = 0
	const renderQueue = ARR.unique(query)
	for (let i of renderQueue) i()
	ARR.empty(query)
	return true
}

export { queue, inform, exec }
