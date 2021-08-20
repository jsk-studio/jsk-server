import { IValidatorCheck } from './middlewares/vaildate'
export { default as app } from './modules/app'
export * from './modules/base'
export * from './modules/server'
export * from './routers/creator'
export * from './middlewares/vaildate'
import { Context } from 'koa'
import { RouterContext } from 'koa-router'

type JSKContext = {
    config: { device: string },
    params: ( checks: IValidatorCheck[] ) => any,
}

declare module 'koa' {
    export interface DefaultContext {
        jsk: JSKContext
    }
}
declare module 'koa-router' {
    export interface IRouterParamContext<StateT = any, CustomT = {}> {
        jsk: JSKContext
    }
}
