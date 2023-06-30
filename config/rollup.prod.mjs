// Import base config
import base from './rollup.base.mjs'

base.output.file = `${base.proPath}/${base.bundle}.min.js`

delete base.bundle
delete base.devPath
delete base.proPath

export default base
