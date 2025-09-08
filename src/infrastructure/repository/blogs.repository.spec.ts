import { Test, TestingModule } from '@nestjs/testing';
import { SqliteModule } from '../db/sqlite.module';
import { ConfigModule } from '@nestjs/config';
import { BlogsRepository } from './blogs.repository';

describe('BlogsRepository', () => {
    let blogsRepository: BlogsRepository;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
                SqliteModule,
            ],
            providers: [BlogsRepository],
        }).compile();

        blogsRepository = app.get<BlogsRepository>(BlogsRepository);
    });

    it('should define', () => {
        expect(blogsRepository).toBeDefined();
    });

    const insertData = {
        authorId: 1,
        title: 'test',
        content: 'content test',
    };
    const updateData = {
        title: 'test_updated',
        content: 'content test_updated',
    };

    it('full CRUD', async () => {
        const newBlog = await blogsRepository.createBlog(insertData);
        expect(newBlog).toMatchObject(insertData);

        const foundBlog = await blogsRepository.getBlogByID(newBlog.id);
        expect(foundBlog).toMatchObject(insertData);

        const updatedBlog = await blogsRepository.updateBlog({
            id: newBlog.id,
            ...updateData,
        });
        expect(updatedBlog).toMatchObject(updateData);

        await blogsRepository.deleteBlog(newBlog.id);
    });
});
