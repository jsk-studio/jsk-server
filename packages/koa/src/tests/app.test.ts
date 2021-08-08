import app from '../modules/app'

import Router, { RouterContext } from 'koa-router'
import { IRouterHandlers } from '../modules/base'
import { queryParams } from '../index'

const route: IRouterHandlers = {
    test1: async(ctx: any) => {
        const x = ctx.validate([
            { name: 'name', type: 'number', rules: []},
            { name: 'desc', param:'name2', type: 'string', rules: []},
            { name: 'xxx', type: 'string[]', rules: []},
        ])
        ctx.body = x
    },
    testerror: async(ctx: any) => {
        ctx.xxx()
    }
}


const router = new Router()
router.get('/test', route.test1)
router.get('/error', route.testerror)

router.get('/test', test1_route)

const users = [
    { name: 'name', type: 'number', rules: []},
    { name: 'desc', param:'name2', type: 'string', rules: []},
    { name: 'xxx', type: 'string[]', rules: []},
] as const

app.use(queryParams)
app.use(router.middleware())
app.use(router.allowedMethods())

async function test1_route(ctx: RouterContext) {
    // const user = ctx.jsk.query(users)
    ctx.request.body
}


const mockQuery = {
    name: '123',
    name2: '123abc',
}

const mockBody = {
    xxx: ['abc', '456']
}


// test('test for app base', async () => {
//     const res = await request(app.callback())
//         .get('/test')
//         .query(mockQuery)
//         .send(mockBody)
//     expect(res.body).toMatchObject({
//         "desc": "123abc", "name": 123, "xxx": ["abc", "456"]
//     })
// })

// test('test for app error', async () => {
//     const res = await request(app.callback())
//         .get('/error')
//         .query(mockQuery)
//         .send(mockBody)
//     expect(res.body).toMatchObject({})
// })