import mysql from 'mysql2/promise'

type ITransationCallback<T> = () => Promise<T>

export async function startTransation<T>(conn: mysql.PoolConnection, callback: ITransationCallback<T>) {
    let res: T
    try {
        await conn.beginTransaction()
        res = await callback()
        await conn.commit()
    } catch (e) {
        await conn?.rollback()
        throw e
    } finally {
        conn?.release()
    }
    return res
}

// TODO: connect test
// type IQueryResult<T = any> = {
//     rows: T[],
//     fileds: mysql.FieldPacket[],
    
// }
// type IConnectDSLKeyword = 'SELECT' | 'UPDATE' | 'DELETE' | 'INSERT'
// type IConnectDSLInfer<T extends string> = T extends `${infer L} ${infer R}` ? L : unknown

// type X = IConnectDSLInfer<'SELECT xxx'>
// const IConnectDSLVals = 'SELECT'

// interface IConnectDSLTemplate<T> extends ReadonlyArray<T> {
//     readonly raw: readonly string[];
// }

// function testFun<T extends string, Q = IConnectDSLInfer<T>>(strs: ReadonlyArray<T>, ...args: any) {
//     return strs[0] as any as Q & IConnectDSLKeyword
// }

// const val = testFun`SELECT x`
// const val2 = testFun(['SELECT x', 'xxxx '], 1)
// type TVal = typeof val
// type TVal2 = typeof val2