import { IValidatorCheck } from './middlewares/vaildate'
export { default as app } from './modules/app'
export * from './modules/base'
export * from './modules/server'
export * from './routers/creator'
export * from './middlewares/vaildate'

type JSKContext = {
    config: { device: string },
    params: ( checks: IValidatorCheck[] ) => any,
}

declare module 'koa' {
    interface DefaultContext {
        jsk: JSKContext
    }
}
