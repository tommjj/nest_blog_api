import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { SqliteModule } from '../db/sqlite.module';
import { ConfigModule } from '@nestjs/config';

describe('UsersRepository', () => {
    let usersRepository: UsersRepository;

    beforeAll(async () => {
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

    const insertData = {
        name: 'ray',
        email: 'ray@mail.com',
        password: '1234567899a',
    };
    const updateData = {
        name: 'ray_updated',
        email: 'ray_updated@mail.com',
        password: 'ray_updated234567899a',
    };

    it('full CRUD', async () => {
        const newUser = await usersRepository.createUser(insertData);
        expect(newUser).toMatchObject(insertData);

        const foundUser = await usersRepository.getUserById(newUser.id);
        expect(foundUser).toMatchObject(insertData);

        const updatedUser = await usersRepository.updateUser({
            id: newUser.id,
            ...updateData,
        });
        expect(updatedUser).toMatchObject(updateData);

        await usersRepository.deleteUser(newUser.id);
    });
});
