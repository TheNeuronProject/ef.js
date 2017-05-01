import create from './utils/creator.js'
import { resolveReactivePath, resolveSubscriber } from './utils/resolver.js'
import initBinding from './utils/binding.js'
import ARR from './utils/array-helper.js'
import { assign } from './utils/polyfills.js'

const unsubscribe = (_path, fn, subscribers) => {
	const pathArr = _path.split('.')
	const subscriberNode = resolveSubscriber(pathArr, subscribers)
	ARR.remove(subscriberNode, fn)
}

const update = function(newState) {
	const tmpState = assign({}, newState)
	if (tmpState.$data) {
		assign(this.$data, tmpState.$data)
		delete(tmpState.$data)
	}
	if (tmpState.$methods) {
		assign(this.$methods, tmpState.$methods)
		delete(tmpState.$methods)
	}
	assign(this, tmpState)
}

const destroy = function() {
	for (let i in this) {
		this[i] = null
		delete this[i]
	}
	delete this.$element
	delete this.$before
	delete this.$after
	delete this.$parent
	delete this.$data
	delete this.$methods
	delete this.$refs
	delete this.$subscribe
	delete this.$unsubscribe
}

const state = class {
	constructor (ast) {
		const children = {}
		const refs = {}
		const innerData = {}
		const methods = {}
		const handlers = {}
		const subscribers = {}
		const domInfo = {
			before: document.createTextNode(''),
			after: document.createTextNode('')
		}
		Object.defineProperties(this, {
			$element: {
				get() {
					return domInfo.element
				},
				configurable: true
			},
			$before: {
				get() {
					return domInfo.element
				},
				configurable: true
			},
			$after: {
				get() {
					return domInfo.element
				},
				configurable: true
			},
			$parent: {
				get() {
					return domInfo.parent
				},
				configurable: true
			},
			$methods: {
				get() {
					return methods
				},
				set(newMethods) {
					assign(methods, newMethods)
				},
				configurable: true
			},
			$refs: {
				value: refs,
				configurable: true
			},
			$subscribe: {
				value: (pathStr, subscriber) => {
					const _path = pathStr.split('.')
					const { dataNode, subscriberNode, _key } = initBinding({bind: [_path], state: this, handlers, subscribers, innerData})
					// Execute subscriber immediately
					subscriber({state: this, value: dataNode[_key]})
					subscriberNode.push(subscriber)
				},
				configurable: true
			},
			$unsubscribe: {
				value: (_path, fn) => {
					unsubscribe(_path, fn, subscribers)
				},
				configurable: true
			}
		})
		// Init root data node
		resolveReactivePath(['$data'], this, false)

		domInfo.element = create({ast, state: this, innerData, refs, children, handlers, subscribers, create})
	}

	get $attached() {
		return !!this.$element.parentNode
	}
}

Object.defineProperties(state.prototype, {
	$update: {
		value: update
	},
	$destroy: {
		value: destroy
	}
})

export default state
