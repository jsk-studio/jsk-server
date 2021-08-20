import { readTomlConfig } from "../utils"

export const authConfigs = readTomlConfig<IAuthConfigs>('auth')

type MapKeyTypes<T> = { [key in string] : T } & T

type IAuthConfigs = {
    aliyun?: MapKeyTypes<IAliyunAuth>,
    wechat?: MapKeyTypes<IWechatAuth>,
    mysql?: MapKeyTypes<IMysqlAuth>,
    redis?: MapKeyTypes<IRedisAuth>,
}

type IAliyunAuth = {
    accessKeyId: string,
    accessKeySecret: string,
    accountId: number,
}

type IWechatAuth = {
    appId: string,
    appSecret: string,
}

type IMysqlAuth = {
    user: string,
    password: string,
}

type IRedisAuth = {
    password: string,
}