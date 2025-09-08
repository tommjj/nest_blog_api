import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { errors } from 'src/core/domain/errors';
import { ZodType } from 'zod/v4';

/**
 * ZodBodyValidationPipe validation body
 */
@Injectable()
export class ZodBodyValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        if (metadata.type !== 'body') {
            return value;
        }

        try {
            const parsed = this.schema.parse(value);

            return parsed;
        } catch (e: unknown) {
            throw errors.InvalidData('', undefined, e);
        }
    }
}

/**
 * ZodValidationPipe validation
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(
        private schema: ZodType,
        private type?: 'body' | 'query' | 'param' | 'custom',
    ) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        if (this.type && metadata.type !== this.type) {
            return value;
        }

        try {
            const parsed = this.schema.parse(value);

            return parsed;
        } catch (e: unknown) {
            throw errors.InvalidData('', undefined, e);
        }
    }
}
