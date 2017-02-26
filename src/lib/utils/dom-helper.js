const proto = Node.prototype
// const safeZone = document.createDocumentFragment()

const DOM = {
	// addClass(node, className) {
	// 	const classes = className.split(' ')
	// 	node.classList.add(...classes)
	// },

	// removeClass(node, className) {
	// 	const classes = className.split(' ')
	// 	node.classList.remove(...classes)
	// },

	// toggleClass(node, className) {
	// 	const classes = className.split(' ')
	// 	const classArr = node.className.split(' ')
	// 	for (let i of classes) {
	// 		const classIndex = classArr.indexOf(i)
	// 		if (classIndex > -1) {
	// 			classArr.splice(classIndex, 1)
	// 		} else {
	// 			classArr.push(i)
	// 		}
	// 	}
	// 	node.className = classArr.join(' ').trim()
	// },

	// replaceWith(node, newNode) {
	// 	const parent = node.parentNode
	// 	if (parent) proto.replaceChild.call(parent, newNode, node)
	// },

	// swap(node, newNode) {
	// 	const nodeParent = node.parentNode
	// 	const newNodeParent = newNode.parentNode
	// 	const nodeSibling = node.nextSibling
	// 	const newNodeSibling = newNode.nextSibling
	// 	if (nodeParent && newNodeParent) {
	// 		proto.insertBefore.call(nodeParent, newNode, nodeSibling)
	// 		proto.insertBefore.call(newNodeParent, node, newNodeSibling)
	// 	}
	// },

	before(node, ...nodes) {
		if (node.parentNode) {
			const tempFragment = document.createDocumentFragment()
			nodes.reverse()
			for (let i of nodes) {
				proto.appendChild.call(tempFragment, i)
			}
			proto.insertBefore.call(node.parentNode, tempFragment, node)
		}
	},

	after(node, ...nodes) {
		if (node.parentNode) {
			const tempFragment = document.createDocumentFragment()
			for (let i of nodes) {
				proto.appendChild.call(tempFragment, i)
			}
			if (node.nextSibling) {
				proto.insertBefore.call(node.parentNode, tempFragment, node.nextSibling)
			} else {
				proto.appendChild.call(node.parentNode, tempFragment)
			}
		}
	},

	append(node, ...nodes) {
		if ([1,9,11].indexOf(node.nodeType) === -1) {
			return
		}
		const tempFragment = document.createDocumentFragment()
		for (let i of nodes) {
			proto.appendChild.call(tempFragment, i)
		}
		proto.appendChild.call(node, tempFragment)
	},

	// prepend(node, ...nodes) {
	// 	if ([1,9,11].indexOf(node.nodeType) === -1) {
	// 		return
	// 	}
	// 	const tempFragment = document.createDocumentFragment()
	// 	nodes.reverse()
	// 	for (let i of nodes) {
	// 		proto.appendChild.call(tempFragment, i)
	// 	}
	// 	if (node.firstChild) {
	// 		proto.insertBefore.call(node, tempFragment, node.firstChild)
	// 	} else {
	// 		proto.appendChild.call(node, tempFragment)
	// 	}
	// },

	// appendTo(node, newNode) {
	// 	proto.appendChild.call(newNode, node)
	// },

	// prependTo(node, newNode) {
	// 	if (newNode.firstChild) {
	// 		proto.insertBefore.call(newNode, node, node.firstChild)
	// 	} else {
	// 		proto.appendChild.call(newNode, node)
	// 	}
	// },

	// empty(node) {
	// 	node.innerHTML = ''
	// },

	remove(node) {
		proto.removeChild.call(node.parentNode, node)
	},

	// safeRemove(node) {
	// 	proto.appendChild.call(safeZone, node)
	// }
}

export default DOM
