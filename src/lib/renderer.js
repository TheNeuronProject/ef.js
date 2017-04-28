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
	const innerData = {}
	const methods = {}
	const handlers = {}
	const subscribers = {}
	Object.defineProperties(state, {
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
				const { dataNode, subscriberNode, _key } = initBinding({bind: [_path], state, handlers, subscribers, innerData})
				// Execute subscriber immediately
				subscriber({state, value: dataNode[_key]})
				subscriberNode.push(subscriber)
			},
			configurable: true
		},
		$unsubscribe: {
			value: (_path, fn) => {
				unsubscribe(_path, fn, subscribers)
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
	// Init root data node
	resolveReactivePath(['$data'], state, false)

	Object.defineProperty(state, '$element', {
		value: create({ast, state, innerData, refs, children, handlers, subscribers, create}),
		configurable: true
	})
	return state
}

export default render
