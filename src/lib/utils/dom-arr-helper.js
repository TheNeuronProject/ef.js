import DOM from './dom-helper.js'
import ARR from './array-helper.js'
import { warnAttachment } from '../debug.js'

const _placeHolder = new WeakMap()

const DOMARR = {
	pop() {
		if (this.length === 0) return
		const poped = ARR.pop(this)
		DOM.remove(poped.$element)
		return poped
	},
	push(...items) {
		const elements = []
		for (let i of items) {
			if (i.$attached) {
				warnAttachment(i)
				ARR.remove(items, i)
			} else ARR.push(elements, i.$element)
		}
		if (this.length === 0) DOM.after(_placeHolder.get(this), ...elements)
		else DOM.after(this[this.length - 1].$element, ...elements)
		return ARR.push(this, ...items)
	},
	remove(...items) {
		const removedItems = []
		for (let i of items) {
			const removed = ARR.remove(this, i)
			if (removed) {
				DOM.remove(removed)
				ARR.push(removedItems, removed)
			}
		}
		return removedItems
	},
	reverse() {
		if (this.length === 0) return this
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$element, insertPoint)
		const elements = []
		for (let i = this.length - 1; i >= 0; i--) ARR.push(elements, this[i].$element)
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
		return ARR.reverse(this)
	},
	shift() {
		if (this.length === 0) return
		const shifted = ARR.shift(this)
		DOM.remove(shifted.$element)
		return shifted
	},
	sort(fn) {
		if (this.length === 0) return this
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$element, insertPoint)
		const sorted = ARR.sort(this, fn)
		const elements = []
		for (let i of this) ARR.push(elements, i.$element)
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
		return sorted
	},
	splice(...args) {
		if (this.length === 0) return this
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$element, insertPoint)
		const spliced = ARR.splice(this, ...args)
		const elements = []
		for (let i of spliced) DOM.remove(i.$element)
		for (let i of this) ARR.push(elements, i.$element)
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
		return spliced
	},
	unshift(...items) {
		if (this.length === 0) return this.push(...items).length
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$element, insertPoint)
		const elements = []
		for (let i of items) {
			if (i.$attached) {
				warnAttachment(i)
				ARR.remove(items, i)
			} else ARR.push(elements, i.$element)
		}
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
		return ARR.unshift(this, ...items)
	}
}

export default DOMARR
export { _placeHolder }
