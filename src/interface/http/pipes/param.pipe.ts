import { Injectable, PipeTransform } from '@nestjs/common';
import { errors } from 'src/core/domain/errors';
import z from 'zod/v4';

const intValidate = z.coerce.number().int();

@Injectable()
export class IntPipe implements PipeTransform<string, number> {
    constructor() {}

    transform(value: unknown) {
        try {
            const parsed = intValidate.parse(value);

            return parsed;
        } catch (e: unknown) {
            throw errors.InvalidData('', undefined, e);
        }
    }
}
