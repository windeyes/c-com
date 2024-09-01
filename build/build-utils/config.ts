import path from 'path';
import { chenComOutDir } from './paths';
export const modules = ['esm', 'cjs'] as const;
export type Module = (typeof modules)[number];
export const buildConfig = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(chenComOutDir, 'es'),
    },
    bundle: {
      path: 'chen-com/es',
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(chenComOutDir, 'lib'),
    },
    bundle: {
      path: 'chen-com/lib',
    },
  },
};
export type BuildConfig = typeof buildConfig;
export enum PKG  {
  PKG_PREFIX = '@chen-com',
  PKG_NAME = 'chen-com',
}