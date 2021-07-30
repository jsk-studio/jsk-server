
import app from '../modules/app'
import { 
    initialize,
    normalizeData,
    normalizeError,
    // requestProxy,
    // staticProxy,
} from '../middlewares'
import Router from 'koa-router'
import { ssrRouter } from '../routers/ssrRouter'
import { apiRouter } from '../routers/apiRouter'

type IServerMiddleware = {
    staticProxy?: any,
    requestProxy?: any,
    configure?: any,
}
type IServerConfigure = {
    middlewares?: IServerMiddleware,
    baseRouter?: Router,
}

export const createServer = (routers: Router[], config = {} as IServerConfigure) => {
    const {
        middlewares = {},
        baseRouter = apiRouter,
    } = config

    app.use(initialize)

    if (middlewares.configure) {
        app.use(middlewares.configure)
    }
    
    app.use(normalizeError)

    if (middlewares.staticProxy) {
        app.use(middlewares.staticProxy)
    }

    app.use(normalizeData)
    // app.use(validateParams)

    if (middlewares.requestProxy) {
        app.use(middlewares.requestProxy)
    }

    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })

    if (baseRouter) {
        app.use(baseRouter.routes())
        app.use(baseRouter.allowedMethods())
    }

    return app
}


// export function createSSRServer(routers: Router[]) {
//     return createServer({ 
//         routers,
//         middlewares: {
//             request: requestProxy(),
//             static: staticProxy(),
//         },
//         baseRouter: ssrRouter,
//     })
// }

// export function createAPIServer(routers: Router[], middleWares: IServerMiddleware) {
//     return createServer({ 
//         routers,
//         middlewares: {
//             // request: requestProxy(),
//             ...middleWares,
//         },
//         baseRouter: apiRouter,
//     })
// }