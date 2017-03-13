import _assign from 'object.assign'
import _WeakMap from 'weak-map'

const _define = (obj, name, val) => Object.defineProperty(obj, name, { value: val })

if (!Object.assign) _define(Object, 'assign', _assign)
if (!window.WeakMap) _define(window, 'WeakMap', _WeakMap)
