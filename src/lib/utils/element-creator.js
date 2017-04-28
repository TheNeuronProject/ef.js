import ARR from './array-helper.js'
import initBinding from './binding.js'
import { queue, inform, exec } from './render-query.js'
import { warn } from '../debug.js'

const getElement = (tag, ref, refs) => {
	const element = document.createElement(tag)
	if (ref) Object.defineProperty(refs, ref, {
		value: element,
		enumerable: true
	})
	return element
}

const updateOthers = ({dataNode, handlerNode, subscriberNode, handler, state, _key, value}) => {
	if (dataNode[_key] === value) return
	dataNode[_key] = value
	const query = ARR.copy(handlerNode)
	ARR.remove(query, handler)
	queue(query)
	inform()
	for (let i of subscriberNode) i({state, value})
	exec()
}

const addValListener = ({dataNode, handlerNode, subscriberNode, handler, state, element, key, _key}) => {
	const _update = () => updateOthers({dataNode, handlerNode, subscriberNode, handler, state, _key, value: element.value})
	if (key === 'value') {
		element.addEventListener('input', _update, true)
		element.addEventListener('keyup', _update, true)
		element.addEventListener('change', _update, true)
	} else element.addEventListener('change', () => updateOthers({dataNode, handlerNode, subscriberNode, handler, state, _key, value: element.checked}), true)
}

const addAttr = ({element, attr, key, state, handlers, subscribers, innerData}) => {
	if (typeof attr === 'string') element.setAttribute(key, attr)
	else {
		const { dataNode, handlerNode, _key } = initBinding({bind: attr, state, handlers, subscribers, innerData})
		const handler = () => element.setAttribute(key, dataNode[_key])
		handlerNode.push(handler)
		queue([handler])
	}
}

const addProp = ({element, prop, key, state, handlers, subscribers, innerData}) => {
	if (typeof prop === 'string') element[key] = prop
	else {
		const {dataNode, handlerNode, subscriberNode, _key} = initBinding({bind: prop, state, handlers, subscribers, innerData})
		const handler = () => {
			element[key] = dataNode[_key]
		}
		handlerNode.push(handler)
		if (key === 'value' || key === 'checked') addValListener({dataNode, handlerNode, subscriberNode, handler, state, element, key, _key})
		queue([handler])
	}
}

const getData = ({v, state, handlers, subscribers, innerData}) => {
	if (Array.isArray(v)) return initBinding({bind: v, state, handlers, subscribers, innerData})
	return {dataNode: {v}, _key: 'v'}
}

const addEvent = ({element, event, state, handlers, subscribers, innerData}) => {

	/**
	 *  l: listener									: string
	 *  m: method                   : string
	 *  s: stopPropagation          : number/undefined
	 *  i: stopImmediatePropagation : number/undefined
	 *  p: preventDefault           : number/undefined
	 *  h: shiftKey                 : number/undefined
	 *  a: altKey                   : number/undefined
	 *  c: ctrlKey                  : number/undefined
	 *  t: metaKey                  : number/undefined
	 *  u: capture                  : number/undefined
	 *  k: keyCodes                 : array/undefined
	 *  v: value                    : string/array/undefined
	 */
	const {l, m, s, i, p, h, a, c, t, u, k, v} = event
	const {dataNode, _key} = getData({v, state, handlers, subscribers, innerData})
	element.addEventListener(l, (e) => {
		if (!!h !== !!e.shiftKey ||
			!!a !== !!e.altKey ||
			!!c !== !!e.ctrlKey ||
			!!t !== !!e.metaKey ||
			(k && k.indexOf(e.which) === -1)) return
		if (s) e.stopPropagation()
		if (i) e.stopImmediatePropagation()
		if (p) e.preventDefault()
		if (state.$methods[m]) state.$methods[m]({e, value: dataNode[_key], state})
		else warn(`Method named '${m}' not found!`)
	}, !!u)
}

const createElement = ({info, state, innerData, refs, handlers, subscribers}) => {

	/**
	 *  t: tag       : string
	 *  a: attr      : object
	 *  p: prop      : object
	 *  e: event     : array
	 *  r: reference : string
	 */
	const {t, a, p, e, r} = info
	const element = getElement(t, r, refs)
	for (let i in a) addAttr({element, attr: a[i], key: i, state, handlers, subscribers, innerData})
	for (let i in p) addProp({element, prop: p[i], key: i, state, handlers, subscribers, innerData})
	for (let i in e) addEvent({element, event: e[i], state, handlers, subscribers, innerData})
	return element
}

export default createElement
