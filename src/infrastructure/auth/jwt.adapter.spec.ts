import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { JWTAdapter } from './jwt.adapter';
import { TokenPayload } from '../../core/domain/auth';

describe('JWTAdapter', () => {
    let jwtAdapter: JWTAdapter;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                JWTAdapter,
                {
                    provide: ConfigService,
                    useValue: {
                        get: (key: string) => {
                            if (key === 'AUTH_SECRET') return 'test_secret';
                            if (key === 'EXPIRES_IN') return '1000';
                            return null;
                        },
                    },
                },
            ],
        }).compile();

        jwtAdapter = moduleRef.get<JWTAdapter>(JWTAdapter);
    });

    it('should define', () => {
        expect(jwtAdapter).toBeDefined();
    });

    const tokenPayload: TokenPayload = {
        id: 1,
        name: 'ray',
        email: 'ray@mail.com',
    };

    it('sign and verify token', () => {
        const token = jwtAdapter.signToken(tokenPayload);
        expect(token).toBeDefined();

        const result = jwtAdapter.verifyToken(token);
        expect(result).toMatchObject(tokenPayload);
    });
});
