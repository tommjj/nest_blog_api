import { DomainError, errors, ErrorType } from '../domain/errors';
import { IKVCachePort } from '../port/cache.port';
import { ILoggerPort } from '../port/logger.port';
import { ParseResult } from '../services/dto/type';

type CacheResult<T> =
    | {
          v: T;
          ok: true;
      }
    | {
          err: unknown;
          ok: false;
      };

export async function cacheGet<T>(
    v: Promise<any>,
    parser: (v: any) => ParseResult<T>,
): Promise<CacheResult<T>> {
    try {
        const parsed = parser(await v);
        if (parsed.ok) {
            return parsed;
        }
        return {
            err: errors.InvalidData(),
            ok: false,
        };
    } catch (e: unknown) {
        return {
            err: e,
            ok: false,
        };
    }
}

type Key = string | number;

export type CacheErrorHandler = {
    handleGet: (key: Key, err: unknown) => void;
    handleSet: (key: Key, err: unknown) => void;
    handleDel: (key: Key, err: unknown) => void;
};

export const newDefaultCacheErrorHandler = (
    prefix: string,
    logger: ILoggerPort,
) => ({
    handleGet(key: Key, err: unknown) {
        if (err instanceof DomainError) {
            if (err.is(ErrorType.ErrNotFound)) {
                return;
            }
            logger.error(`${err.type}: ${err.privateMessage}`);
        } else {
            logger.error(`internal error: ${err as any}`);
        }
    },
    handleSet(key: Key, err: unknown) {
        logger.error(`set cache error with key ${prefix}${key}: ${err as any}`);
    },
    handleDel(key: Key, err: unknown) {
        if (err instanceof DomainError) {
            logger.error(`${err.type}: ${err.privateMessage}`);
        } else {
            logger.error(`internal error: ${err as any}`);
        }
    },
});

export class CacheHelper<T> {
    constructor(
        private readonly cache: IKVCachePort,
        private readonly parser: (v: any) => ParseResult<T>,
        private readonly prefix: string,
        private readonly ttl: number,
        private readonly errorHandler: CacheErrorHandler,
    ) {}

    async set(key: Key, value: T) {
        try {
            await this.cache.set(`${this.prefix}${key}`, value, this.ttl);
        } catch (err) {
            this.errorHandler.handleSet(key, err);
        }
    }

    async get(key: Key): Promise<T | undefined> {
        const result = await cacheGet(
            this.cache.get(`${this.prefix}${key}`),
            this.parser,
        );
        if (result.ok) {
            return result.v;
        }

        this.errorHandler.handleGet(key, result.err);
    }

    async del(key: Key) {
        try {
            await this.cache.del(`${this.prefix}${key}`);
        } catch (err: any) {
            this.errorHandler.handleDel(key, err);
        }
    }
}
