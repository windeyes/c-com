import path from 'path'
export const rootDir = path.resolve(__dirname,'../../')
export const distDir = path.resolve(rootDir,'dist')
export const chenComOutDir = path.resolve(distDir, 'chen-com');

export const themeChalk = path.resolve(distDir,'theme-chalk')

export const pkgRoot = path.resolve(rootDir,'packages')
export const chenComUi = path.resolve(pkgRoot,'chen-com-ui')