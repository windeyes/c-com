import path from 'path'
import { mkdir, readFile, writeFile } from 'fs/promises'

import { pathRewriter,withTaskName } from "@chen-com/build-utils";
import { rootDir, chenComOutDir, pkgRoot, excludeFiles, chenComUi } from "@chen-com/build-utils";
import { series } from 'gulp'

import glob from 'fast-glob'
import * as VueCompiler from '@vue/compiler-sfc'
import type { CompilerOptions, SourceFile } from 'ts-morph'
import { Project } from 'ts-morph'
async function genTypes() {
  const compilerOptions: CompilerOptions = {
    emitDeclarationOnly: true,
    allowJs: true,
    declaration: true,
    outDir: path.resolve(chenComOutDir, 'types'),
    baseUrl: rootDir,
    preserveSymlinks: true,
    skipLibCheck: true,
  };
  const project = new Project({
    compilerOptions,
    tsConfigFilePath: path.resolve(rootDir, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });
  // 获取要转义的sourcefiles
  const soruceFiles = await addSourceFiles(project)
  const tasks = soruceFiles.map(async sourceFile=>{
    const emitOutput = sourceFile.getEmitOutput() //
    const emitFiles = emitOutput.getOutputFiles()
    const subTasks = emitFiles.map(async outputFile =>{
      const filepath = outputFile.getFilePath()
      await mkdir(path.dirname(filepath),{
        recursive:true
      })
      await writeFile(filepath,pathRewriter('esm')(outputFile.getText()),'utf-8')
    })
    await Promise.all(subTasks)
  })
  await Promise.all(tasks)
}
async function addSourceFiles(project: Project) {
  const globSourceFile = '**/*.{js?(x),ts?(x),vue}';
  // 出了总导出和excludeFiles中排除的项 其他全放入
  const exFileS =  await glob([globSourceFile, '!chen-com-ui'], {
    cwd: pkgRoot,
    onlyFiles: true,
    absolute: true,
  })
  const filePaths = excludeFiles(
    exFileS
  );
  
  
  // 总导出（chen-com-ui）里面的 
  const epPaths = excludeFiles(
    await glob(globSourceFile, {
      cwd: chenComUi,
      onlyFiles: true,
    }),
  );
  console.log('epPaths',epPaths);
  const sourceFiles: SourceFile[] = []
  // js及ts可以直接设置为sourceFile .vue需要转化一下
  await Promise.all([
    ...filePaths.map(async file => {
      if (file.endsWith('.vue')) {
        const content = await readFile(file, 'utf-8')
        const sfc = VueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let scriptContent = script?.content ?? ''
          if (scriptSetup) {
            const compiled = VueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx'
            });
            scriptContent += compiled.content
          }
          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(`${file}.${lang}`, scriptContent)
          sourceFiles.push(sourceFile)
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    }),
    ...epPaths.map(async file => {
      const content = await readFile(path.resolve(chenComUi, file), 'utf-8');
      sourceFiles.push(project.createSourceFile(path.resolve(pkgRoot, file), content));
    }
    )

  ])
  return sourceFiles
}
export const buildGenTypes = series(withTaskName('buildGenTypes', genTypes))