import ARR from './array-helper.js'

const query = []
let count = 0

const queue = handlers => query.push(...handlers)

const inform = () => {
	count += 1
	return count
}

const exec = (immediate) => {
	if (!immediate && (count -= 1) > 0) return count
	count = 0
	const renderQueue = ARR.unique(query)
	for (let i of renderQueue) i()
	ARR.empty(query)
	return count
}

export { queue, inform, exec }
