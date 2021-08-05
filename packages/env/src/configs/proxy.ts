import { readTomlConfig } from "../utils"

export const proxyConfigs = readProxyConfigs()

type IProxyMap<T> = {
    [key in string]?: T
}

type IProxyConfigs = IProxyMap<{
    to: string,
    target?: string,
    client?: string,
}>

type IHttpProxyConfig = IProxyMap<{
    target: string,
    changeOrigin: boolean,
    pathRewrite: any
}>

type IClientProxyConfig = IProxyMap<{
    to: string,
    from: string,
    client: string, 
}>

function readProxyConfigs() {
    const httpProxy = {} as IHttpProxyConfig
    const clientProxy = {} as IClientProxyConfig
    const proxies = readTomlConfig<IProxyConfigs>('proxy')

    for (const from of Object.keys(proxies)) {
        const conf = proxies[from]
        if (!conf) {
            continue
        }
        const { to, target, client } = conf  
        
        if (client) {
            clientProxy[`^${from}`] = { 
                from, 
                to: to || from, 
                client, 
            }
            continue
        }
        if (!target) {
            continue
        }
        httpProxy[`^${from}`] = {
            target,
            changeOrigin: true,
            pathRewrite: {
                [`^${from}`]: to || from,
            }
        }
    } 
    return { httpProxy, clientProxy }
}
