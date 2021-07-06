
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
    static?: any,
    request?: any,
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

    if (middlewares.static) {
        app.use(middlewares.static)
    }

    app.use(normalizeData)
    // app.use(validateParams)

    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })

    if (middlewares.request) {
        app.use(middlewares.request)
    }

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