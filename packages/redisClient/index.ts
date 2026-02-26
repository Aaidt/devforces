import Redis from "ioredis"

let redis: Redis | null = null;

export function get_redis_client(): Redis {
    if(!redis){
        redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
            lazyConnect: true
        });

        redis.on('connect', () => console.log("Connected to redis"));
        redis.on('error', (err) => console.log("Redis error: ", err));
    }

    return redis
}

export async function disconnect_redis_client(){
    if(redis){
        await redis.quit();
        redis = null;
    }
}