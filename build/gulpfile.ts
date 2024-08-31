import {withTaskName,run} from './build-utils/index'
import {series,parallel} from 'gulp'
import buildModules from './modules'
import {buildFullComponent} from './full-component'


export default series(
    withTaskName('cleanDist',async ()=>{run('npm run clean')}),
    parallel(
        buildModules,
        // buildFullComponent
    )
)