import DOM from './dom-helper.js'
import ARR from './array-helper.js'
import { inform, exec } from './render-query.js'
import { warnAttachment } from '../debug.js'

const DOMARR = {
	empty() {
		inform()
		for (let i of this) i.$destroy()
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
		for (let i of items) ARR.push(elements, i.$mount(state, key))
		if (this.length === 0) DOM.after(anchor, ...elements)
		else DOM.after(this[this.length - 1].$after, ...elements)
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
	reverse({state, key}) {
		if (this.length === 0) return this
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$before, insertPoint)
		const elements = []
		inform()
		for (let i = this.length - 1; i >= 0; i--) ARR.push(elements, this[i].$mount(state, key))
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
		exec()
		return ARR.reverse(this)
	},
	shift() {
		if (this.length === 0) return
		const shifted = ARR.shift(this)
		shifted.$umount()
		return shifted
	},
	sort({state, key}, fn) {
		if (this.length === 0) return this
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$before, insertPoint)
		const sorted = ARR.sort(this, fn)
		const elements = []
		inform()
		for (let i of this) ARR.push(elements, i.$mount(state, key))
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
		exec()
		return sorted
	},
	splice({state, key}, ...args) {
		if (this.length === 0) return this
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$before, insertPoint)
		const spliced = ARR.splice(this, ...args)
		const elements = []
		inform()
		for (let i of spliced) i.$umount()
		for (let i of this) ARR.push(elements, i.$mount(state, key))
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
		exec()
		return spliced
	},
	unshift({state, key}, ...items) {
		if (this.length === 0) return this.push(...items).length
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$before, insertPoint)
		const elements = []
		inform()
		for (let i of items) {
			if (i.$parent) return warnAttachment(i)
			ARR.push(elements, i.$mount(state, key))
		}
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
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
