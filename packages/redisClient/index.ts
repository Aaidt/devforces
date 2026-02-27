import Redis from "ioredis"

let redis: Redis | null = null;

export function get_redisClient(): Redis {
    if(!redis){
        redis = new Redis({
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
            lazyConnect: true
        });

        redis.on('connect', () => console.log("Connected to redis"));
        redis.on('error', (err) => console.log("Redis error: ", err));
    }

    return redis
}

export async function disconnect_redisClient(){
    if(redis){
        await redis.quit();
        redis = null;
    }
}