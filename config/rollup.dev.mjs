// Import base config
import base from './rollup.base.mjs'
// Import browsersync config
import bsConfig from './bs-config.mjs'
// Import dev plugins
import browsersync from 'rollup-plugin-browsersync'

base.output.file = `${base.devPath}/${base.bundle}.dev.js`
base.plugins.push(browsersync(bsConfig))
base.watch = {
	include: ['src/**/*.*']
}

delete base.bundle
delete base.devPath
delete base.proPath

export default base
