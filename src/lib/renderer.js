import create from './utils/creator.js'
import { resolveReactivePath, resolveSubscriber } from './utils/resolver.js'
import initBinding from './utils/binding.js'
import ARR from './utils/array-helper.js'
import DOM from './utils/dom-helper.js'
import { assign } from './utils/polyfills.js'
import { queueDom, inform, exec } from './utils/render-query.js'

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
	const {$element, $after, $before} = this
	inform()
	this.$umount()
	for (let i in this) {
		this[i] = null
		delete this[i]
	}
	queueDom(() => {
		DOM.remove($element)
		DOM.remove($after)
		DOM.remove($before)
	})
	delete this.$element
	delete this.$before
	delete this.$after
	delete this.$parent
	delete this.$key
	delete this.$data
	delete this.$methods
	delete this.$refs
	delete this.$mount
	delete this.$umount
	delete this.$subscribe
	delete this.$unsubscribe
	return exec()
}

const state = class {
	constructor (ast) {
		const children = {}
		const refs = {}
		const innerData = {}
		const methods = {}
		const handlers = {}
		const subscribers = {}
		const nodeInfo = {
			before: document.createTextNode(''),
			after: document.createTextNode(''),
			parent: null,
			key: null
		}

		const safeZone = document.createDocumentFragment()
		const mount = () => DOM.after(nodeInfo.before, nodeInfo.element)

		Object.defineProperties(this, {
			$element: {
				get() {
					return nodeInfo.element
				},
				configurable: true
			},
			$before: {
				get() {
					return nodeInfo.before
				},
				configurable: true
			},
			$after: {
				get() {
					return nodeInfo.after
				},
				configurable: true
			},
			$parent: {
				get() {
					return nodeInfo.parent
				},
				configurable: true
			},
			$key: {
				get() {
					return nodeInfo.key
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
			$mount: {
				value: function(target, key, holder) {
					if (typeof target === 'string') {
						target = document.querySelector(target)
						key = '__DIRECTMOUNT__'
					}

					if (nodeInfo.parent) this.$umount()

					nodeInfo.parent = target
					nodeInfo.key = key
					DOM.append(safeZone, nodeInfo.before)
					DOM.append(safeZone, nodeInfo.after)
					queueDom(mount)

					if (target instanceof Element) {
						DOM.append(target, safeZone)
						inform()
						return exec()
					}

					if (holder) {
						DOM.after(holder, safeZone)
						inform()
						return exec()
					}

					return safeZone
				},
				configurable: true
			},
			$umount: {
				value: function() {
					const {parent, key} = nodeInfo
					nodeInfo.parent = null
					nodeInfo.key = null
					if (parent && key !== '__DIRECTMOUNT__' && parent[key]) {
						if (Array.isArray(parent[key])) {
							parent[key].remove(this)
						} else parent[key] = null
						return
					}
					DOM.append(safeZone, nodeInfo.before)
					DOM.append(safeZone, nodeInfo.after)
					inform()
					queueDom(mount)
					return exec()
				},
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

		nodeInfo.element = create({ast, state: this, innerData, refs, children, handlers, subscribers, create})
	}
}

Object.defineProperties(state.prototype, {
	$update: {value: update},
	$destroy: {value: destroy}
})

export default state
