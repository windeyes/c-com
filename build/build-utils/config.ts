import path from 'path';
import { distDir } from './paths';
export const modules = ['esm', 'cjs'] as const;
export type Module = (typeof modules)[number];
export const buildConfig = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(distDir, 'es'),
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
      path: path.resolve(distDir, 'lib'),
    },
    bundle: {
      path: 'chen-com/lib',
    },
  },
};
export type BuildConfig = typeof buildConfig;
