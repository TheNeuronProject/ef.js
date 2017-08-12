import create from './utils/creator.js'
import { resolveReactivePath, resolveSubscriber } from './utils/resolver.js'
import initBinding from './utils/binding.js'
import ARR from './utils/array-helper.js'
import DOM from './utils/dom-helper.js'
import { assign } from './utils/polyfills.js'
import { queueDom, inform, exec } from './utils/render-query.js'

const unsubscribe = (_path, fn, subscribers) => {
	const subscriberNode = resolveSubscriber(_path, subscribers)
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
	this.$umount()
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

// All detatched components will be put in the safe zone zone
const safeZone = document.createDocumentFragment()

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
			replace: [],
			parent: null,
			key: null
		}

		if (ENV !== 'production') nodeInfo.avatar = document.createComment('AVATAR OF COMPONENT')

		const mount = () => {
			if (nodeInfo.replace.length > 0) {
				for (let i of nodeInfo.replace) DOM.remove(i)
				ARR.empty(nodeInfo.replace)
			}
			DOM.before(nodeInfo.avatar, nodeInfo.element)
		}

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
				value: function({target, option, parent, key}) {
					if (typeof target === 'string') target = document.querySelector(target)

					inform()
					if (nodeInfo.parent) {
						this.$umount()
						if (ENV !== 'production') console.warn('[EF]', 'Component detached from previous mounting point.')
					}

					if (!parent) parent = target
					if (!key) key = '__DIRECTMOUNT__'
					nodeInfo.parent = parent
					nodeInfo.key = key
					queueDom(mount)

					if (!target) {
						exec()
						return nodeInfo.avatar
					}

					switch (option) {
						case 'before': {
							DOM.before(target, nodeInfo.avatar)
							break
						}
						case 'after': {
							DOM.after(target, nodeInfo.avatar)
							break
						}
						case 'replace': {
							DOM.before(target, nodeInfo.avatar)
							nodeInfo.replace.push(target)
							break
						}
						default: {
							DOM.append(target, nodeInfo.avatar)
						}
					}
					return exec()
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
						if (Array.isArray(parent[key])) ARR.remove(parent[key], this)
						else {
							parent[key] = null
							return exec()
						}
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
