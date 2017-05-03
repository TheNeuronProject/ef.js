import create from './utils/creator.js'
import { resolveReactivePath, resolveSubscriber } from './utils/resolver.js'
import initBinding from './utils/binding.js'
import ARR from './utils/array-helper.js'
import DOM from './utils/dom-helper.js'
import { assign } from './utils/polyfills.js'
import { queueDom, inform, exec } from './utils/render-query.js'
import { warn } from './debug.js'

const unsubscribe = (_path, fn, subscribers) => {
	const pathArr = _path.split('.')
	const subscriberNode = resolveSubscriber(pathArr, subscribers)
	ARR.remove(subscriberNode, fn)
}

const update = function(newState) {
	inform()
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
	exec()
}

const destroy = function() {
	const {$element, $avatar} = this
	inform()
	for (let i in this) {
		this[i] = null
		delete this[i]
	}
	queueDom(() => {
		DOM.remove($element)
		DOM.remove($avatar)
	})
	delete this.$element
	delete this.$avatar
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
			avatar: document.createTextNode(''),
			parent: null,
			key: null
		}

		const safeZone = document.createDocumentFragment()
		const mount = () => DOM.before(nodeInfo.avatar, nodeInfo.element)

		inform()
		Object.defineProperties(this, {
			$element: {
				get() {
					return nodeInfo.element
				},
				configurable: true
			},
			$avatar: {
				get() {
					return nodeInfo.avatar
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

					inform()
					if (nodeInfo.parent) {
						this.$umount()
						warn(`Component detached from previous mounting point.`)
					}

					nodeInfo.parent = target
					nodeInfo.key = key
					queueDom(mount)

					if (target instanceof Element) {
						DOM.append(target, nodeInfo.avatar)
						return exec()
					}

					if (holder) {
						DOM.after(holder, nodeInfo.avatar)
						return exec()
					}

					exec()
					return nodeInfo.avatar
				},
				configurable: true
			},
			$umount: {
				value: function() {
					const {parent, key} = nodeInfo
					nodeInfo.parent = null
					nodeInfo.key = null

					inform()
					if (parent && key !== '__DIRECTMOUNT__' && parent[key]) {
						if (Array.isArray(parent[key])) {
							parent[key].remove(this)
						} else parent[key] = null
						return exec()
					}
					DOM.append(safeZone, nodeInfo.avatar)
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
		DOM.append(safeZone, nodeInfo.avatar)
		queueDom(mount)
		exec()
	}
}

Object.defineProperties(state.prototype, {
	$update: {value: update},
	$destroy: {value: destroy}
})

export default state
