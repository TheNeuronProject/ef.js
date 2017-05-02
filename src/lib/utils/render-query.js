import ARR from './array-helper.js'
import {info} from '../debug.js'

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

	if (query.length > 0) {
		const renderQuery = ARR.unique(query)
		if (ENV !== 'production') info(`${query.length} modification operations cached, ${renderQuery.length} executed.`)
		for (let i of renderQuery) i()
		ARR.empty(query)
	}

	if (domQuery.length > 0) {
		const domRenderQuery = ARR.rightUnique(domQuery)
		if (ENV !== 'production') info(`${domQuery.length} DOM operations cached, ${domRenderQuery.length} executed.`)
		for (let i of domRenderQuery) i()
		ARR.empty(domQuery)
	}
	return count
}

export { queue, queueDom, inform, exec }
