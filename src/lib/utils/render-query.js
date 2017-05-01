import ARR from './array-helper.js'

const query = []
const domQuery = []
let count = 0

const queue = handlers => query.push(...handlers)

const queueDom = handler => domQuery.push(handler)

const inform = () => {
	count += 1
	return count
}

const exec = (immediate) => {
	if (!immediate && (count -= 1) > 0) return count
	count = 0
	const renderQuery = ARR.unique(query)
	const domRenderQuery = ARR.rightUnique(domQuery)
	for (let i of renderQuery) i()
	for (let i of domRenderQuery) i()
	ARR.empty(query)
	ARR.empty(domQuery)
	return count
}

export { queue, queueDom, inform, exec }
