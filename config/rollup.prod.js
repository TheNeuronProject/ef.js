// Import base config
import base from './rollup.base'

if (process.env.BUILD_TARGET === 'production') base.output.file = `${base.proPath}/${base.bundle}.min.js`
else base.output.file = `${base.proPath}/${base.bundle}.dev.js`

base.output.sourcemap = process.env.BUILD_ENV === 'DEMO' || process.env.BUILD_ENV === 'CI' ? base.output.sourcemap : false

delete base.bundle
delete base.devPath
delete base.proPath

export default base
