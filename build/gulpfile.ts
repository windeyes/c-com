import {withTaskName,run} from './build-utils/index'
import {series,parallel} from 'gulp'
import buildModules from './modules'
import {buildFullComponent} from './full-component'
import {buildGenTypes} from './gen-types'

export default series(
    withTaskName('cleanDist',async ()=>run('pnpm run clean')),
    parallel(
        buildModules,
        buildFullComponent,
        buildGenTypes
    )
)