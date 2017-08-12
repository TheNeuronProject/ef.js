import ARR from './array-helper.js'

const query = []
const domQuery = []
const userQuery = []
let count = 0

const queue = handlers => query.push(...handlers)
const queueDom = handler => domQuery.push(handler)
const onRender = handler => userQuery.push(handler)

const inform = () => {
	count += 1
	return count
}

const exec = (immediate) => {
	if (!immediate && (count -= 1) > 0) return count
	count = 0

	if (query.length > 0) {
		const renderQuery = ARR.unique(query)
		for (let i of renderQuery) i()
		if (ENV !== 'production') console.info('[EF]', `${query.length} modification operations cached, ${renderQuery.length} executed.`)
		ARR.empty(query)
	}

	if (domQuery.length > 0) {
		const domRenderQuery = ARR.rightUnique(domQuery)
		for (let i of domRenderQuery) i()
		if (ENV !== 'production') console.info('[EF]', `${domQuery.length} DOM operations cached, ${domRenderQuery.length} executed.`)
		ARR.empty(domQuery)
	}

	if (userQuery.length > 0) {
		const userFnQuery = ARR.unique(userQuery)
		for (let i of userFnQuery) i()
		if (ENV !== 'production') console.info('[EF]', `${userQuery.length} user operations cached, ${userFnQuery.length} executed.`)
		ARR.empty(userQuery)
	}
	return count
}

const bundle = (cb) => {
	inform()
	return exec(cb(inform, exec))
}

export { queue, queueDom, onRender, inform, exec, bundle }
