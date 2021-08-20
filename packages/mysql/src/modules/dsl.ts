import { createSampleSQL, ISQLMapper } from './builder'
import { xParse } from '@jsk-std/x'
import mysql from 'mysql2/promise'

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

export function createSampleDSL<T = any>(name: string, mapper: ISQLMapper<T>[]) {
    const builder = createSampleSQL(name, mapper)
    const exec = (key: string, arg: any[]) => {
        if (!key) {
            return
        }
        if (key === 'SELECT' && arg && arg.join('')) {
            for (let i = 0; i < arg.length; i++) {
                if (Array.isArray(arg[i])) {
                    arg[i] = `[${arg[i]}]`
                }
            }
            const m = (arg.join('')).split(/\[|\]/)
            m[0] = m[0].toUpperCase()
            if (!['INC', 'EXC'].includes(m[0])) {
                m[0] = 'INC'
            } 
            arg = [m[0], (m[1] || '').trim().split(/\s*,\s*/g)]
        }
        if (key === 'SQL') {
            arg = ['WHERE', ...arg]
        }
        (builder as any)[key](...arg)
    }
    return function(strs: TemplateStringsArray, ...args: any[]) {
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
        return builder.END() as string & T
    }
}

type IDSLType<T> = (strs: TemplateStringsArray, ...args: any[]) => string & T

export function connectDSL<T = any>(conn: mysql.PoolConnection, dsl: IDSLType<T>) {
    return async function(strs: TemplateStringsArray, ...args: any[]) {
        const sql = dsl(strs, ...args)

        let rows = [] as T[]
        let fileds = [] as mysql.FieldPacket[]
        let result = {} as mysql.ResultSetHeader

        const [ queryRows, queryFileds ] =  await conn.query<any>(sql)
        fileds = queryFileds
        if (strs[0].includes('SELECT')) {
            rows = queryRows
        } else {
            result = queryRows
        }
        return { rows, fileds, result, firstRow: rows[0] || undefined }
    }
}
