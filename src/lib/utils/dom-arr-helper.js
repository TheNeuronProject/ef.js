import DOM from './dom-helper.js'
import ARR from './array-helper.js'
import { inform, exec } from './render-query.js'

const DOMARR = {
	empty() {
		inform()
		for (let i of ARR.copy(this)) i.$destroy()
		exec()
		ARR.empty(this)
	},
	pop() {
		if (this.length === 0) return
		const poped = ARR.pop(this)
		poped.$umount()
		return poped
	},
	push({state, key, anchor}, ...items) {
		const elements = []
		inform()
		for (let i of items) ARR.push(elements, i.$mount({parent: state, key}))
		if (this.length === 0) DOM.after(anchor, ...elements)
		else DOM.after(this[this.length - 1].$avatar, ...elements)
		exec()
		return ARR.push(this, ...items)
	},
	remove(...items) {
		const removedItems = []
		inform()
		for (let i of items) {
			const removed = ARR.remove(this, i)
			if (removed) {
				removed.$umount()
				ARR.push(removedItems, removed)
			}
		}
		exec()
		return removedItems
	},
	reverse({state, key, anchor}) {
		if (this.length === 0) return this
		const tempArr = ARR.copy(this)
		const elements = []
		inform()
		for (let i = tempArr.length - 1; i >= 0; i--) {
			tempArr[i].$umount()
			ARR.push(elements, tempArr[i].$mount({parent: state, key}))
		}
		ARR.push(this, ...ARR.reverse(tempArr))
		DOM.after(anchor, ...elements)
		exec()
		return this
	},
	shift() {
		if (this.length === 0) return
		const shifted = ARR.shift(this)
		shifted.$umount()
		return shifted
	},
	sort({state, key, anchor}, fn) {
		if (this.length === 0) return this
		const sorted = ARR.copy(ARR.sort(this, fn))
		const elements = []
		inform()
		for (let i of sorted) {
			i.$umount()
			ARR.push(elements, i.$mount({parent: state, key}))
		}
		ARR.push(this, ...sorted)
		DOM.after(anchor, ...elements)
		exec()
		return this
	},
	splice({state, key, anchor}, ...args) {
		if (this.length === 0) return this
		const spliced = ARR.copy(ARR.splice(this, ...args))
		inform()
		for (let i of spliced) i.$umount()
		exec()
		return spliced
	},
	unshift({state, key, anchor}, ...items) {
		if (this.length === 0) return this.push(...items).length
		const elements = []
		inform()
		for (let i of items) {
			if (i.$parent) {
				if (ENV !== 'production') console.warn('[EF] Better detach the component before attaching it to a new component!')
				return
			}
			i.$umount()
			ARR.push(elements, i.$mount({parent: state, key}))
		}
		DOM.after(anchor, ...elements)
		exec()
		return ARR.unshift(this, ...items)
	}
}

const defineArr = (arr, info) => {
	Object.defineProperties(arr, {
		empty: {value: DOMARR.empty},
		pop: {value: DOMARR.pop},
		push: {value: DOMARR.push.bind(arr, info)},
		remove: {value: DOMARR.remove},
		reverse: {value: DOMARR.reverse.bind(arr, info)},
		shift: {value: DOMARR.shift},
		sort: {value: DOMARR.sort.bind(arr, info)},
		splice: {value: DOMARR.splice.bind(arr, info)},
		unshift: {value: DOMARR.unshift.bind(arr, info)}
	})
	return arr
}

export default defineArr
