import { errors } from '../domain/errors';
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
