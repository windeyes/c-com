import {withTaskName,run,chenComUi, chenComOutDir,rootDir,buildConfig} from './build-utils'
import {series,parallel,src,dest} from 'gulp'
import type {TaskFunction} from 'gulp'
import path from 'path'
import { copy } from 'fs-extra'
import buildModules from './modules'
import {buildFullComponent} from './full-component'
import {buildGenTypes} from './gen-types'
// 处理package.json和readme.md资源
const copyFiles = ()=>{
    const copyPackage = ()=>src(`${chenComUi}/package.json`).pipe(dest(chenComOutDir))
    const copyReadme = ()=> src(`${rootDir}/README.md`).pipe(dest(chenComOutDir))
    return Promise.all([copyPackage(),copyReadme()])
}
// 为es和lib中加入type
export const copyTypesDefinitions: TaskFunction = (done) => {
    const src = path.resolve(chenComOutDir, 'types')
    const copyTypes = (module) =>
      withTaskName(`copyTypes:${module}`, () =>
        copy(src, buildConfig[module].output.path, { recursive: true })
      )
  
    return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
  }
export default series(
    withTaskName('cleanDist',async ()=>run('pnpm run clean')),
    parallel(
        buildModules,
        buildFullComponent,
        buildGenTypes,
        series(
            withTaskName('buildThemeChalk', () =>
              run('pnpm run build:theme')
            )
          )
    ),
    parallel(copyTypesDefinitions, copyFiles),
)