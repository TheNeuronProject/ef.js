// Import base config
import base from './rollup.base'

base.output.file = base.proDest
base.output.sourcemap = process.env.BUILD_ENV === 'DEMO' || process.env.BUILD_ENV === 'CI' ? base.output.sourcemap : false

export default base
