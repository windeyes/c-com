import {rootDir} from './paths'
export const excludeFiles = (files: string[]) => {
    const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
    return files.filter((path) => {
      const position = path.startsWith(rootDir) ? rootDir.length : 0
      return !excludes.some((exclude) => path.includes(exclude, position))
    })
}

export function generateExternal({full:boolean}){
  // 
  const packages = ['vue','gulpfile','@vue','node_modules','@chen-com']
  // filterDep
  return function(id){
      return packages.some(path=>{
          return /[/|\/]${path}/.test(path) || path.includes(id)
      })
  }

}