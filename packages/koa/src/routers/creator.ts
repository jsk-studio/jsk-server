
import app from '../modules/app'
import { 
    initialize,
    normalizeData,
    normalizeError,
    queryParams,
} from '../middlewares'
import Router from 'koa-router'
import { apiRouter } from '../routers/apiRouter'

type IServerMiddleware = {
    staticProxy?: any,
    requestProxy?: any,
    configure?: any,
    cors?: any,
}

export const createServer = (
    routers: Router[], 
    middlewares = {} as IServerMiddleware, 
    defaultRouter = apiRouter,
) => {

    app.use(initialize)

    if (middlewares.configure) {
        app.use(middlewares.configure)
    }
    
    app.use(normalizeError)

    if (middlewares.staticProxy) {
        app.use(middlewares.staticProxy)
    }

    app.use(normalizeData)
    app.use(queryParams)

    routers.forEach(router => {
        app.use(router.routes())
        app.use(router.allowedMethods())
    })

    if (middlewares.requestProxy) {
        app.use(middlewares.requestProxy)
    }

    if (defaultRouter) {
        app.use(defaultRouter.routes())
        app.use(defaultRouter.allowedMethods())
    }

    if (middlewares.cors) {
        app.use(middlewares.cors)
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