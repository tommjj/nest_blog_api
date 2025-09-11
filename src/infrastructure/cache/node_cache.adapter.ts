/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { IKVCachePort } from 'src/core/port/cache.port';
import NodeCache from 'node-cache';
import { errors } from 'src/core/domain/errors';

/**
 * NodeCacheAdapter a adapter implements IKVCachePort, using node-cache lib
 */
@Injectable()
export class NodeCacheAdapter implements IKVCachePort {
    private cache: NodeCache;

    constructor() {
        this.cache = new NodeCache();
    }

    async Set(key: string, value: any, ttl: number): Promise<void> {
        this.cache.set(key, value, ttl);
    }

    async MSet<T>(ttl: number, kv: Record<string, T>): Promise<void> {
        this.cache.mset(
            Object.entries(kv).map(([key, value]) => ({
                key: key,
                val: value,
                ttl: ttl,
            })),
        );
    }

    async SetNX(key: string, value: any, ttl: number): Promise<void> {
        if (!this.cache.has(key)) {
            this.cache.set(key, value, ttl);
        }
    }

    async Get(key: string): Promise<any> {
        const result = this.cache.get(key);
        if (result === undefined || result === null) {
            throw errors.NotFound(`cache missing key ${key}`);
        }
        return result;
    }

    async MGet(keys: string[]): Promise<any[]> {
        const result = this.cache.mget(keys);
        return keys.map((key) => result[key]);
    }

    async Exists(key: string): Promise<boolean> {
        return this.cache.has(key);
    }

    async DelByPrefix(prefix: string): Promise<void> {
        const keys = this.cache.keys().filter((key) => key.startsWith(prefix));
        this.cache.del(keys);
    }

    async Del(key: string): Promise<void> {
        this.cache.del(key);
    }
}
