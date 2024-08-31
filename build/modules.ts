import glob from 'fast-glob'
import {  excludeFiles, pkgRoot,generateExternal } from '@chen-com/build-utils'
import {rollup } from 'rollup';
import type { OutputOptions,ModuleFormat } from 'rollup'
import vue from '@vitejs/plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from "rollup-plugin-esbuild";
import commonjs from '@rollup/plugin-commonjs'
import {writeBundles,buildConfig,chenComUi} from './build-utils'
export default async function  buildModules(){
    // package下所有ts文件
    const input = excludeFiles(
        await glob('**/*.{js,ts,vue}', {
          cwd: pkgRoot,
          absolute: true,
          onlyFiles: true,
        })
    )
    const bundle = await rollup({
        input,
        plugins:[
            vue({
                isProduction:true
            }),
            nodeResolve({
                extensions: ['.mjs', '.js', '.json', '.ts'],// 修正@文件引入
            }),
            esbuild({
                sourceMap:true,
                target:'es2018'
            }),
            commonjs()
        ],
        external:await generateExternal({ full: false }),
        treeshake: false,
    })
    await writeBundles(
        bundle,
        Object.entries(buildConfig).map(([module,config]):OutputOptions=>{
            return {
                format:config.format  as ModuleFormat,
                dir:config.output.path,
                exports:module === 'cjs'?'named':undefined,
                entryFileNames:`[name].${config.ext}`,
                preserveModules:true,
                preserveModulesRoot: chenComUi,
            }
        })
    )
}