import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { SqliteModule } from '../db/sqlite.module';
import { ConfigModule } from '@nestjs/config';

describe('UsersRepository', () => {
    let usersRepository: UsersRepository;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
                SqliteModule,
            ],
            providers: [UsersRepository],
        }).compile();

        usersRepository = app.get<UsersRepository>(UsersRepository);
    });

    it('should define', () => {
        expect(usersRepository).toBeDefined();
    });
});
