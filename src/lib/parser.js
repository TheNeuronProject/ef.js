import eftParser from 'eft-parser'

const parse = (template, parser) => {
	if (!parser) parser = eftParser
	return parser(template)
}

export default parse
