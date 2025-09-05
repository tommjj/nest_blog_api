import { Injectable, PipeTransform } from '@nestjs/common';
import { errors } from 'src/core/domain/errors';
import { ZodType } from 'zod/v4';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) {}

    transform(value: unknown) {
        try {
            const parsed = this.schema.parse(value);

            return parsed;
        } catch (e: unknown) {
            throw errors.InvalidData('', undefined, e);
        }
    }
}
