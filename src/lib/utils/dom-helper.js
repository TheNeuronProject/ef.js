const safeZone = document.createDocumentFragment()

const DOM = {
	addClass(node, className) {
		const classes = className.split(' ')
		node.classList.add(...classes)
	},

	removeClass(node, className) {
		const classes = className.split(' ')
		node.classList.remove(...classes)
	},

	toggleClass(node, className) {
		const classes = className.split(' ')
		const classArr = node.className.split(' ')
		for (let i of classes) {
			const classIndex = classArr.indexOf(i)
			if (classIndex > -1) {
				classArr.splice(classIndex, 1)
			} else {
				classArr.push(i)
			}
		}
		node.className = classArr.join(' ').trim()
	},

	replaceWith(node, newNode) {
		const parent = node.parentNode
		if (parent) parent.replaceChild(newNode, node)
	},

	swap(node, newNode) {
		const nodeParent = node.parentNode
		const newNodeParent = newNode.parentNode
		const nodeSibling = node.nextSibling
		const newNodeSibling = newNode.nextSibling
		if (nodeParent && newNodeParent) {
			nodeParent.insertBefore(newNode, nodeSibling)
			newNodeParent.insertBefore(node, newNodeSibling)
		}
	},

	before(node, ...nodes) {
		if (node.parentNode) {
			const tempFragment = document.createDocumentFragment()
			nodes.reverse()
			for (let i of nodes) {
				tempFragment.appendChild(i)
			}
			node.parentNode.insertBefore(tempFragment, node)
		}
	},

	after(node, ...nodes) {
		if (node.parentNode) {
			const tempFragment = document.createDocumentFragment()
			for (let i of nodes) {
				tempFragment.appendChild(i)
			}
			if (node.nextSibling) {
				node.parentNode.insertBefore(tempFragment, node.nextSibling)
			} else {
				node.parentNode.append(tempFragment)
			}
		}
	},

	append(node, ...nodes) {
		if ([1,9,11].indexOf(node.nodeType) === -1) {
			return
		}
		const tempFragment = document.createDocumentFragment()
		for (let i of nodes) {
			tempFragment.appendChild(i)
		}
		node.appendChild(tempFragment)
	},

	prepend(node, ...nodes) {
		if ([1,9,11].indexOf(node.nodeType) === -1) {
			return
		}
		const tempFragment = document.createDocumentFragment()
		nodes.reverse()
		for (let i of nodes) {
			tempFragment.appendChild(i)
		}
		if (node.firstChild) {
			node.insertBefore(tempFragment, node.firstChild)
		} else {
			node.appendChild(tempFragment)
		}
	},

	appendTo(node, newNode) {
		newNode.appendChild(node)
	},

	prependTo(node, newNode) {
		if (newNode.firstChild) {
			newNode.insertBefore(node, node.firstChild)
		} else {
			newNode.appendChild(node)
		}
	},

	empty(node) {
		node.innerHTML = ''
	},

	remove(node) {
		node.parentNode.removeChild(node)
	},

	safeRemove(node) {
		safeZone.appendChild(node)
	}
}

export default DOM
