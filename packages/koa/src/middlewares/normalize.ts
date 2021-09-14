import { PassThrough } from 'stream'
import { Context, Next } from 'koa'
import { ERROR_CODE } from '../constants'

export const initialize = async (ctx: Context, next: Next) => {
    const ua = ctx.header['user-agent']!
    const isMobile = /AppleWebKit.*Mobile.*/i.test(ua)
    const device = isMobile ? 'mobile' : 'web'
    ctx.jsk = {} as any
    ctx.jsk.config = { device }
    // 默认开启代理模式, 对应 app.proxy = true
    ctx.headers['x-forwarded-proto'] = ctx.headers['x-forwarded-proto'] || 'https'
    await next()
}

export const normalizeError = async (ctx: Context, next: Next) => {
    try {
        await next()
    } catch(err) {
        console.log(err)
        if (!err.message) {
            err.message = 'Unknow Error'
        }
        if (!err.code) {
            err.code = -1
        }
        
        if (err.code == -1 || err.code >= ERROR_CODE.UNKNOW) {
            const { code, message, ...context } = err
            ctx.body = { code, data: { message }, ...context }
            return
        }
        const logMessage = `Internal Server Error: ${err.message}; ${JSON.stringify(err)}; ${new Date().toISOString()}`
        console.error(logMessage + `; ${JSON.stringify(ctx)}`)
        if (err.code >= 100 && err.code <= 9999) {
            ctx.body = logMessage
            ctx.status = err.code
        } else {
            ctx.body = logMessage
            ctx.status = 500
        }
    }
}

export const normalizeData = async (ctx: Context, next: Next) => {
    await next()
    // TODO: 寻求更好的判断方法 ing
    const isObject = typeof ctx.body === 'object' && !(ctx.body instanceof PassThrough)
    // @ts-ignore
    if (isObject && typeof ctx.body.code === 'undefined') {
        const data = JSON.parse(JSON.stringify(ctx.body))
        ctx.body = { code: 0, data }
    }
    if (typeof ctx.body === 'string') {
        ctx.body = { code: 0, message: ctx.body }
    }
    if (typeof ctx.body === 'boolean') {
        ctx.body = { code: 0, success: ctx.body }
    }
}