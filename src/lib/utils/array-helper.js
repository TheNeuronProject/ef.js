const proto = Array.prototype

const ARR = {
	copy(arr) {
		return proto.slice.call(arr, 0)
	},
	equals(left, right) {
		if (!Array.isArray(right)) return false
		if (left === right) return true
		if (left.length !== right.length) return false
		for (let i in left) if (left[i] !== right[i]) return false
		return true
	},
	pop(arr) {
		return proto.pop.call(arr)
	},
	push(arr, ...items) {
		return proto.push.apply(arr, items)
	},
	remove(arr, item) {
		const index = proto.indexOf.call(arr, item)
		if (index > -1) {
			proto.splice.call(arr, index, 1)
			return item
		}
	},
	reverse(arr) {
		return proto.reverse.call(arr)
	},
	shift(arr) {
		return proto.shift.call(arr)
	},
	slice(arr, index, length) {
		return proto.slice.call(arr, index, length)
	},
	sort(arr, fn) {
		return proto.sort.call(arr, fn)
	},
	splice(arr, ...args) {
		return proto.splice.apply(arr, args)
	},
	unshift(arr, ...items) {
		return proto.unshift.apply(arr, items)
	}
}

export default ARR
