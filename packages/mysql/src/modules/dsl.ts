import { createSampleSQL } from './builder'
import { xParse } from '@jsk-std/x'

const keywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'WHERE',
    'ORDER',
    'TOTAL',
    'DELETE',
    'LIMIT',
    'JOIN',
    'ON',
    'MATCH',
    'SQL',
    'LIKE',
]

export function createSampleDSL(name: string, mapper: any) {
    const builder = createSampleSQL(name, mapper)
    const exec = (key: string, arg: any[]) => {
        if (!key) {
            return
        }
        if (key === 'SQL') {
            arg = ['WHERE', ...arg]
        }
        (builder as any)[key](...arg)
    }
    return function (strs: TemplateStringsArray, ...args: any[]) {
        let mkey = ''
        let margs = [] as any[]
        strs.forEach((str, idx) => {
            // 获得非空可用 keywords
            const arr = str.split(/\s/g).filter(Boolean)
            arr.forEach(key => {
                if (keywords.includes(key)) {
                    exec(mkey, margs)
                    margs = []
                    mkey = key
                } else {
                    margs.push(xParse(key))
                }
            })
            margs.push(args[idx])
            
        })
        if (mkey) {
            exec(mkey, margs)
        }
        return builder.END()
    }
}
