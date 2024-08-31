import { rootDir } from './paths'
import type { TaskFunction } from 'gulp'
import {spawn} from 'child_process'

export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>Object.assign(fn, { displayName: name })

export const run = async (command:string)=>{
    return new Promise<void>((resolve)=>{
        // 将命令分割 如rm -rf
        const [cmd,...args] = command.split(' ')
        const app = spawn(cmd,args,{
            cwd:rootDir,
            stdio:"inherit",
            shell: process.platform === 'win32' // 默认情况下 linux才支持 rm -rf  windows安装git bash
        })
        app.on('close',resolve)
    })
}