import { warn } from '../debug.js'
import initBinding from './binding.js'

const getElement = (tag, _name, nodes) => {
	const element = document.createElement(tag)
	if (_name) Object.defineProperty(nodes, _name, {
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
	if (key === 'value') {
		element.addEventListener('input', () => updateOthers({dataNode, subscriberNode, handler, state, _key, value: element.value}), true)
		element.addEventListener('change', () => updateOthers({dataNode, subscriberNode, handler, state, _key, value: element.value}), true)
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

const addEvent = ({element, event, key, state, subscriber, innerData}) => {
	const [method, value] = event
	if (Array.isArray(value)) {
		const {dataNode, _key} = initBinding({bind: value, state, subscriber, innerData})
		element.addEventListener(key, (e) => {
			if (state.$methods[method]) state.$methods[method]({e, value: dataNode[_key], state})
			else warn(`Method named '${method}' not found!`)
		})
		return
	}
	element.addEventListener(key, (e) => {
		if (state.$methods[method]) state.$methods[method]({e, value, state})
		else warn(`Method named '${method}' not found!`)
	}, false)
}

const createElement = ({info, state, innerData, nodes, subscriber}) => {
	const {t: tag, a: attr, p: prop, e: event, n: _name} = info
	const element = getElement(tag, _name, nodes)
	for (let i in attr) addAttr({element, attr: attr[i], key: i, state, subscriber, innerData})
	for (let i in prop) addProp({element, prop: prop[i], key: i, state, subscriber, innerData})
	for (let i in event) addEvent({element, event: event[i], key: i, state, subscriber, innerData})
	return element
}

export default createElement
