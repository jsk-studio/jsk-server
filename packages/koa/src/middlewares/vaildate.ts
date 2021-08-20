import { Context, Next } from 'koa'
import { xArray, xParse } from '@jsk-std/x'

export async function queryParams (ctx: Context, next: Next) {
    const validator = createVaildator(ctx.query, ctx.request.body)
    ctx.jsk.params = <T = any>(checks: IValidatorCheck[]) => {
        try {
            return validator(checks) as T
        } catch(error) {
            ctx.throw({ code: 'VAILATEOR_ERROR', error })
        }
    }
    await next()
}

function alias(strs: TemplateStringsArray, ...args: any[]) {
    return { name: '' }
}

// const testChecks = [
//     alias: '@:name:string',
// ]

// const testChecks: IValidatorCheck[] = [
//     alias`name|type:string@query``NOT_NULL`
// ]

type ArrayedType<T extends string> = T | `${T}[]`

type IValidatorRule = RegExp | string | ((str: string) => boolean)
type IValilatorType = ArrayedType<'number' | 'string' | 'boolean' | 'date'>

export type IValidatorCheck = {
    name: string,
    key?: string,
    from?: 'query' | 'body',
    type?: IValilatorType,
    rules?: IValidatorRule[],
}

export const RULES = {
    NOT_NULL: (text: string) => text.trim().length > 0,
    REQUIRED: (text: string) => text !== undefined,
}

export function createVaildator(query: any = {}, body: any = {}) {
    return function (checks: IValidatorCheck[]) {
        const errors = [] as any
        const params = {} as any
        for (const check of checks) {
            const { name: checkName, key, type: checkType, from, rules = [] } = check
            const name = key || checkName
            let value: string | string[] = ''
            if (!from) {
                value = query[name] || body[name] || ''
            } else if (from && from === 'query') {
                value = query[name] || ''
            } else if (from && from === 'body') {
                value = body[name] || ''
            }
            if (value && !Array.isArray(value)) {
                value = value.toString()
            }
            let type = checkType as string
            let isArray = false
            if (checkType?.endsWith('[]')) {
                isArray = true
                type = checkType.slice(0, -2)
            }

            if (isArray) {
                value = xArray(value)
            }
            if (!value) {
                continue
            }
            const parsedValue = xParse(value, type)

            params[checkName] = parsedValue
        }
        return params
    }
}
