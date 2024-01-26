import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private redisClient: Redis;

    constructor() {
        this.redisClient = new Redis({
            host: '10.12.2.15',
            port: 6379,
        });
    }

    async addTokenBlackList(key: string, value: string, expireIn: number)
    {
        await this.redisClient.set(key, value, 'EX', expireIn);
    }

    async isTokenBlackListed(key: string)
    {
        const NotValid = await this.redisClient.exists(key);
        if (NotValid)
            return true;
    }
}