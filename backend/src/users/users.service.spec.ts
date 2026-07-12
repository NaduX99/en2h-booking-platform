import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  createQueryBuilderMock,
  createRepositoryMock,
} from '../testing/test-utils';

describe('UsersService', () => {
  let service: UsersService;

  const usersRepository = createRepositoryMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
    usersRepository.createQueryBuilder.mockReturnValue(createQueryBuilderMock());
  });

  it('finds users by normalized email', async () => {
    usersRepository.findOne.mockResolvedValue({ id: 'user-id' });

    await expect(service.findByEmail(' Ada@Example.com ')).resolves.toEqual({
      id: 'user-id',
    });

    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'ada@example.com' },
    });
  });

  it('creates users with trimmed and normalized data', async () => {
    usersRepository.create.mockReturnValue({ id: 'user-id' });
    usersRepository.save.mockResolvedValue({ id: 'user-id' });

    await expect(
      service.create({
        name: ' Ada ',
        email: ' Ada@Example.com ',
        passwordHash: 'hashed-password',
      }),
    ).resolves.toEqual({ id: 'user-id' });

    expect(usersRepository.create).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      passwordHash: 'hashed-password',
      refreshTokenHash: null,
    });
  });

  it('updates the refresh token hash for a user', async () => {
    usersRepository.update.mockResolvedValue({ affected: 1 });

    await expect(
      service.updateRefreshTokenHash('user-id', 'refresh-hash'),
    ).resolves.toBeUndefined();

    expect(usersRepository.update).toHaveBeenCalledWith(
      { id: 'user-id' },
      { refreshTokenHash: 'refresh-hash' },
    );
  });

  it('loads the refresh token hash with a query builder', async () => {
    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getOne.mockResolvedValue({ id: 'user-id' });
    usersRepository.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(
      service.findByIdWithRefreshToken('user-id'),
    ).resolves.toEqual({ id: 'user-id' });

    expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.refreshTokenHash');
    expect(queryBuilder.where).toHaveBeenCalledWith('user.id = :id', {
      id: 'user-id',
    });
  });
});
