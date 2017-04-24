import create from './utils/creator.js'
import { resolveSubscriber } from './utils/resolver.js'
import initBinding from './utils/binding.js'
import ARR from './utils/array-helper.js'
import { assign } from './utils/polyfills.js'

const unsubscribe = (_path, fn, subscriber) => {
	const subscriberNode = resolveSubscriber(_path, subscriber)
	const index = subscriberNode.indexOf(fn)
	if (index === -1) return
	ARR.remove(subscriberNode, fn)
}

const checkAttached = function () {
	return !!this.$element.parentNode
}

const update = function (state) {
	const tmpState = assign({}, state)
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
	delete this.$data
	delete this.$methods
	delete this.$refs
	delete this.$subscribe
	delete this.$unsubscribe
	delete this.$attached
	delete this.$update
	delete this.$destroy
}

const render = (ast) => {
	const state = {}
	const children = {}
	const refs = {}
	const data = {}
	const innerData = {}
	const methods = {}
	const subscriber = {}
	Object.defineProperties(state, {
		$data: {
			get() {
				return data
			},
			set(newData) {
				assign(data, newData)
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
			value: (pathStr, handler) => {
				const _path = pathStr.split('.')
				initBinding({bind: [_path], state, subscriber, innerData, handler})
			},
			configurable: true
		},
		$unsubscribe: {
			value: (_path, fn) => {
				unsubscribe(_path, fn, subscriber)
			},
			configurable: true
		},
		$attached: {
			get: checkAttached,
			configurable: true
		},
		$update: {
			value: update,
			configurable: true
		},
		$destroy: {
			value: destroy,
			configurable: true
		}
	})
	const element = create({ast, state, innerData, refs, children, subscriber, create})
	Object.defineProperty(state, '$element', {
		value: element,
		configurable: true
	})
	return state
}

export default render
