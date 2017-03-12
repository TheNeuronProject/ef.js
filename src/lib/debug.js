'use strict'

import loglevel from 'loglevel'
const tag = '[EF]'
const logger = loglevel.getLogger('ef')

const trace = logger.trace.bind(null, tag)
const debug = logger.debug.bind(null, tag)
const info = logger.info.bind(null, tag)
const warn = logger.warn.bind(null, tag)
const error = logger.error.bind(null, tag)

const warnAttachment = state => trace('Please detatch the component before attaching to a new component! Component to be detatched:', state)

if (ENV === 'production') {
	logger.setLevel('error')
} else {
	logger.setLevel('trace')
}

info('Debug logging enabled!')

export { trace, debug, info, warn, error, warnAttachment }
