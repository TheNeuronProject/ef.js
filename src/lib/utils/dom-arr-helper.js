import DOM from './dom-helper.js'
import ARR from './array-helper.js'

const DOMARR = {
	pop() {
		const poped = ARR.pop(this)
		DOM.remove(poped.$element)
		return poped
	},
	push(...items) {
		const elements = []
		for (let i of items) elements.push(i.$element)
		DOM.after(this[this.length - 1].$element, ...elements)
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
		const elements = []
		const sibling = this[this.length - 1].$element.nextSibling
		for (let i of this) ARR.push(elements, i.$element)
		DOM.before(sibling, ...elements)
		return ARR.reverse(this)
	},
	shift() {
		const shifted = ARR.shift(this)
		DOM.remove(shifted.$element)
		return shifted
	},
	sort(fn) {
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
		const insertPoint = document.createTextNode('')
		DOM.before(this[0].$element, insertPoint)
		const elements = []
		for (let i of items) ARR.push(elements, i.$element)
		DOM.after(insertPoint, ...elements)
		DOM.remove(insertPoint)
		return ARR.unshift(this, ...items)
	}
}

export default DOMARR
