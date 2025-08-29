import { ConfigService } from '@nestjs/config';
import { errors } from '../../core/domain/errors';

export function config(conf: ConfigService) {
    return {
        // STRING
        mustString(key: string): string {
            const value = conf.get<string>(key);
            if (!value) throw errors.ConfigMissing(`${key} is missing`);
            return value;
        },

        stringWithDefault(key: string, def: string): string {
            const value = conf.get<string>(key);
            return value ?? def;
        },

        stringSlice(key: string, sep = ','): string[] {
            const value = conf.get<string>(key);
            if (!value) throw errors.ConfigMissing(`${key} is missing`);
            return value.split(sep);
        },

        stringSliceWithDefault(
            key: string,
            def: string[],
            sep = ',',
        ): string[] {
            const value = conf.get<string>(key);
            return value ? value.split(sep) : def;
        },

        // NUMBER
        mustInt(key: string): number {
            const value = conf.get<string>(key);
            if (!value) throw errors.ConfigMissing(`${key} is missing`);
            const n = parseInt(value, 10);
            if (isNaN(n))
                throw errors.ConfigInvalid(
                    `${key} is not a valid integer: ${value}`,
                );
            return n;
        },

        intWithDefault(key: string, def: number): number {
            const value = conf.get<string>(key);
            if (!value) return def;
            const n = parseInt(value, 10);
            return isNaN(n) ? def : n;
        },

        mustIntSlice(key: string, sep = ','): number[] {
            const value = conf.get<string>(key);
            if (!value) throw errors.ConfigMissing(`${key} is missing`);
            return value.split(sep).map((v) => {
                const n = parseInt(v, 10);
                if (isNaN(n))
                    throw errors.ConfigMissing(
                        `${key} contains invalid integer: ${v}`,
                    );
                return n;
            });
        },

        intSliceWithDefault(key: string, def: number[], sep = ','): number[] {
            const value = conf.get<string>(key);
            if (!value) return def;
            return value.split(sep).map((v) => {
                const n = parseInt(v, 10);
                return isNaN(n) ? 0 : n;
            });
        },

        // BOOLEAN
        mustBool(key: string): boolean {
            const value = conf.get<string>(key);
            if (!value) throw errors.ConfigMissing(`${key} is missing`);
            if (value.toLowerCase() === 'true') return true;
            if (value.toLowerCase() === 'false') return false;
            throw errors.ConfigMissing(
                `${key} is not a valid boolean: ${value}`,
            );
        },

        boolWithDefault(key: string, def: boolean): boolean {
            const value = conf.get<string>(key);
            if (!value) return def;
            if (value.toLowerCase() === 'true') return true;
            if (value.toLowerCase() === 'false') return false;
            return def;
        },

        // DURATION (parse từ số giây hoặc chuỗi như '1h', '30s')
        mustDuration(key: string): number {
            const value = conf.get<string>(key);
            if (!value) throw errors.ConfigMissing(`${key} is missing`);
            const parsed = parseDuration(value);
            if (parsed === null)
                throw errors.ConfigInvalid(
                    `${key} is not a valid duration: ${value}`,
                );
            return parsed;
        },

        durationWithDefault(key: string, def: number): number {
            const value = conf.get<string>(key);
            if (!value) return def;
            const parsed = parseDuration(value);
            return parsed ?? def;
        },
    };
}

// Helper parse duration
function parseDuration(value: string): number | null {
    if (/^\d+$/.test(value)) {
        return parseInt(value, 10); // số giây
    }
    // hỗ trợ '30s', '1m', '1h'
    const match = value.match(/^(\d+)(s|m|h)$/);
    if (!match) return null;
    const n = parseInt(match[1], 10);
    if (isNaN(n)) return null;
    switch (match[2]) {
        case 's':
            return n;
        case 'm':
            return n * 60;
        case 'h':
            return n * 3600;
        default:
            return null;
    }
}
