// Enough for ef's usage, so no need for a full polyfill
const _assign = (ee, er) => {
	for (let i in er) ee[i] = er[i]
	return ee
}

const assign = Object.assign || _assign

export { assign }
