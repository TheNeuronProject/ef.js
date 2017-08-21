import ARR from './array-helper.js'
import { mixVal } from './literals-mix.js'
import initBinding from './binding.js'
import { queue, inform, exec } from './render-query.js'
import getEvent from './event-helper.js'

// SVG tags require namespace to work properly
const createByTag = (tag, svg) => {
	if (svg) return document.createElementNS('http://www.w3.org/2000/svg', tag)
	return document.createElement(tag)
}

const getElement = ({tag, ref, refs, svg}) => {
	const element = createByTag(tag, svg)
	if (ref) Object.defineProperty(refs, ref, {
		value: element,
		enumerable: true
	})
	return element
}

const regTmpl = ({val, state, handlers, subscribers, innerData, handler}) => {
	if (Array.isArray(val)) {
		const [strs, ...exprs] = val
		const tmpl = [strs]
		const _handler = () => handler(mixVal(...tmpl))
		tmpl.push(...exprs.map((item) => {
			const {dataNode, handlerNode, _key} = initBinding({bind: item, state, handlers, subscribers, innerData})
			handlerNode.push(_handler)
			return {dataNode, _key}
		}))
		return _handler
	}
	return () => val
}

const updateOthers = ({dataNode, handlerNode, subscriberNode, _handler, state, _key, value}) => {
	if (dataNode[_key] === value) return
	dataNode[_key] = value
	const query = ARR.copy(handlerNode)
	ARR.remove(query, _handler)
	queue(query)
	inform()
	for (let i of subscriberNode) i({state, value})
	exec()
}

const addValListener = ({_handler, state, handlers, subscribers, innerData, element, key, expr}) => {
	const {dataNode, handlerNode, subscriberNode, _key} = initBinding({bind: expr, state, handlers, subscribers, innerData})
	const _update = () => updateOthers({dataNode, handlerNode, subscriberNode, _handler, state, _key, value: element.value})
	if (key === 'value') {
		// Listen to input, keyup and change events in order to work in most browsers.
		element.addEventListener('input', _update, true)
		element.addEventListener('keyup', _update, true)
		element.addEventListener('change', _update, true)
	} else {
		element.addEventListener('change', () => {
			// Trigger change to the element it-self
			element.dispatchEvent(getEvent('ef-change-event'))
			if (element.tagName === 'INPUT' && element.type === 'radio' && element.name !== '') {
				// Trigger change to the the same named radios
				const radios = document.querySelectorAll(`input[name=${element.name}]`)
				if (radios) {
					const selected = ARR.copy(radios)
					ARR.remove(selected, element)

					/* Event triggering could cause unwanted render triggers
					 * no better ways came up at the moment
					 */
					for (let i of selected) i.dispatchEvent(getEvent('ef-change-event'))
				}
			}
		}, true)
		// Use custom event to avoid loops and conflicts
		element.addEventListener('ef-change-event', () => updateOthers({dataNode, handlerNode, subscriberNode, _handler, state, _key, value: element.checked}))
	}
}

const getAttrHandler = (element, key) => {
	if (key === 'class') return (val) => {
		val = `${val}`.replace(/\s+/g, ' ').trim()
		// Remove attribute when value is empty
		if (!val) return element.removeAttribute(key)
		element.setAttribute(key, val)
	}
	return (val) => {
		// Remove attribute when value is empty
		if (val === '') return element.removeAttribute(key)
		element.setAttribute(key, val)
	}
}

const addAttr = ({element, attr, key, state, handlers, subscribers, innerData}) => {
	if (typeof attr === 'string') element.setAttribute(key, attr)
	else {
		const handler = getAttrHandler(element, key)
		queue([regTmpl({val: attr, state, handlers, subscribers, innerData, handler})])
	}
}

const addProp = ({element, prop, key, state, handlers, subscribers, innerData}) => {
	if (typeof prop === 'string') element[key] = prop
	else {
		const handler = (val) => {
			element[key] = val
		}
		const _handler = regTmpl({val: prop, state, handlers, subscribers, innerData, handler})
		if ((key === 'value' ||
			key === 'checked') &&
			!prop[0]) addValListener({_handler, state, handlers, subscribers, innerData, element, key, expr: prop[1]})
		queue([_handler])
	}
}


const rawHandler = val => val

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
	const _handler = regTmpl({val: v, state, handlers, subscribers, innerData, handler: rawHandler})
	element.addEventListener(l, (e) => {
		if (!!h !== !!e.shiftKey ||
			!!a !== !!e.altKey ||
			!!c !== !!e.ctrlKey ||
			!!t !== !!e.metaKey ||
			(k && k.indexOf(e.which) === -1)) return
		if (s) e.stopPropagation()
		if (i) e.stopImmediatePropagation()
		if (p) e.preventDefault()
		if (state.$methods[m]) state.$methods[m]({e, value: _handler(), state})
		else if (ENV !== 'production') console.warn('[EF]', `Method named '${m}' not found!`)
	}, !!u)
}

const createElement = ({info, state, innerData, refs, handlers, subscribers, svg}) => {

	/**
	 *  t: tag       : string
	 *  a: attr      : object
	 *  p: prop      : object
	 *  e: event     : array
	 *  r: reference : string
	 */
	const {t, a, p, e, r} = info
	const element = getElement({tag: t, ref: r, refs, svg})
	for (let i in a) addAttr({element, attr: a[i], key: i, state, handlers, subscribers, innerData})
	for (let i in p) addProp({element, prop: p[i], key: i, state, handlers, subscribers, innerData})
	for (let i in e) addEvent({element, event: e[i], state, handlers, subscribers, innerData})
	return element
}

export default createElement
