import Redis from 'ioredis';

export type IRedisOptions = {
    host: string,
    password?: string,
}

export type IRedisClient = Redis.Redis & {
  getJSON: <T = any>(key: string) => Promise<T | undefined>
}

// 好像不需要线程池, 所以只剩这么一点了 orz
export function createRedisClient(opts: IRedisOptions) {
  const client = new Redis({
    host: opts.host,
    password: opts.password || undefined,
  })
  client.constructor.prototype.getJSON = async (key: string) => {
    const val = await client.get(key)
    return val && JSON.parse(val)
  }
  return client as IRedisClient
}