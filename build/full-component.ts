import {parallel} from 'gulp'
import {withTaskName} from './build-utils/index'
import vue from '@vitejs/plugin-vue';
import nodeResolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import { rollup } from 'rollup';
import {  writeBundles, chenComOutDir,generateExternal,chenComUi } from './build-utils'
import type { Plugin } from 'rollup';

import path from 'path';
async function buildFullEntry(){
    const plugins: Plugin<any>[] = [
        vue({
          isProduction: true,
        }) as any,
        nodeResolve({
          extensions: ['.mjs', '.js', '.json', '.ts'],
        }),
        esbuild({
          sourceMap: false,
          target: 'es2018',
          loaders: {
            '.vue': 'ts',
          },
        }),
        commonjs(),
      ];
      const bundle = await rollup({
        input: path.resolve(chenComUi, 'index.ts'),
        plugins,
        external: await generateExternal({ full: true }),
      });
      await writeBundles(bundle, [
        {
          format: 'cjs',
          file: path.resolve(chenComOutDir, 'index.full.js'),
          exports: 'named',
          name: 'rrz-web-design',
          sourcemap: false,
          globals: {
            vue: 'Vue',
          },
        },
        {
          format: 'esm',
          file: path.resolve(chenComOutDir, 'index.full.mjs'),
          sourcemap: false,
        },
      ]);
}

export const buildFullComponent = parallel(withTaskName('buildFullComponent', async ()=>Promise.all([buildFullEntry()])));

