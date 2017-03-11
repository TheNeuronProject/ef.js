// Set the escape character
const char = '&'

// Initlize RegExp
const b = new RegExp(`\\${char}b`, 'g')
const t = new RegExp(`\\${char}t`, 'g')
const n = new RegExp(`\\${char}n`, 'g')
const v = new RegExp(`\\${char}v`, 'g')
const f = new RegExp(`\\${char}f`, 'g')
const r = new RegExp(`\\${char}r`, 'g')
const uni = new RegExp(`\\${char}u.{0,4}`, 'g')
const hex = new RegExp(`\\${char}x.{0,2}`, 'g')
const esc = new RegExp(`\\${char}`, 'g')

// Escape unicode sequence
const U2C = (val) => {
	val = val.substring(2)
	val = parseInt(val, 16)
	if (!val) throw new SyntaxError('Invalid Unicode escape sequence')
	return String.fromCodePoint(val)
}

// Escape hexadecimal sequence
const X2C = (val) => {
	val = `00${val.substring(2)}`
	val = parseInt(val, 16)
	if (!val) throw new SyntaxError('Invalid hexadecimal escape sequence')
	return String.fromCodePoint(val)
}

const ESCAPE = (string) => {
	// Split strings
	const splited = string.split(char + char)
	const escaped = []

	// Escape all known escape characters
	for (let i of splited) {
		const escapedStr = i
			.replace(b, '\b')
			.replace(t, '\t')
			.replace(n, '\n')
			.replace(v, '\v')
			.replace(f, '\f')
			.replace(r, '\r')
			.replace(uni, U2C)
			.replace(hex, X2C)
			// Remove all useless escape characters
			.replace(esc, '')
		escaped.push(escapedStr)
	}
	// Return escaped string
	return escaped.join(char)
}

export default ESCAPE
