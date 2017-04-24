import { warn } from '../debug.js'
import initBinding from './binding.js'

const getElement = (tag, ref, refs) => {
	const element = document.createElement(tag)
	if (ref) Object.defineProperty(refs, ref, {
		value: element,
		enumerable: true
	})
	return element
}

const updateOthers = ({dataNode, subscriberNode, handler, state, _key, value}) => {
	if (dataNode[_key] === value) return
	dataNode[_key] = value
	for (let i of subscriberNode) {
		if (i !== handler) i.call(state, value)
	}
}

const addValListener = ({dataNode, subscriberNode, handler, state, element, key, _key}) => {
	const _update = () => updateOthers({dataNode, subscriberNode, handler, state, _key, value: element.value})
	if (key === 'value') {
		element.addEventListener('input', _update, true)
		element.addEventListener('keyup', _update, true)
		element.addEventListener('change', _update, true)
	} else element.addEventListener('change', () => updateOthers({dataNode, subscriberNode, handler, state, _key, value: element.checked}), true)
}

const addAttr = ({element, attr, key, state, subscriber, innerData}) => {
	if (typeof attr === 'string') element.setAttribute(key, attr)
	else initBinding({bind: attr, state, subscriber, innerData, handler: value => element.setAttribute(key, value)})
}

const addProp = ({element, prop, key, state, subscriber, innerData}) => {
	if (typeof prop === 'string') element[key] = prop
	else {
		const handler = (value) => {
			element[key] = value
		}
		const {dataNode, subscriberNode, _key} = initBinding({bind: prop, state, subscriber, innerData, handler})
		if (key === 'value' || key === 'checked') addValListener({dataNode, subscriberNode, handler, state, element, key, _key})
	}
}

const getData = ({v, state, subscriber, innerData}) => {
	if (Array.isArray(v)) return initBinding({bind: v, state, subscriber, innerData})
	return {dataNode: {_: v}, _key: '_'}
}

const addEvent = ({element, event, state, subscriber, innerData}) => {

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
	const {dataNode, _key} = getData({v, state, subscriber, innerData})
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

const createElement = ({info, state, innerData, refs, subscriber}) => {

	/**
	 *  t: tag       : string
	 *  a: attr      : object
	 *  p: prop      : object
	 *  e: event     : array
	 *  r: reference : string
	 */
	const {t, a, p, e, r} = info
	const element = getElement(t, r, refs)
	for (let i in a) addAttr({element, attr: a[i], key: i, state, subscriber, innerData})
	for (let i in p) addProp({element, prop: p[i], key: i, state, subscriber, innerData})
	for (let i in e) addEvent({element, event: e[i], state, subscriber, innerData})
	return element
}

export default createElement
