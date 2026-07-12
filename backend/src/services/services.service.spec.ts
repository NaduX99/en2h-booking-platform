import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { Service } from './entities/service.entity';
import { ServicesService } from './services.service';
import {
  createQueryBuilderMock,
  createRepositoryMock,
} from '../testing/test-utils';

describe('ServicesService', () => {
  let service: ServicesService;

  const servicesRepository = createRepositoryMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: servicesRepository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    jest.clearAllMocks();
    servicesRepository.createQueryBuilder.mockReturnValue(
      createQueryBuilderMock(),
    );
  });

  it('creates services with normalized prices', async () => {
    servicesRepository.create.mockReturnValue({ title: 'Spa' });
    servicesRepository.save.mockResolvedValue({
      id: 'service-id',
      title: 'Spa',
      price: '99.90',
    });

    await expect(
      service.create({
        title: 'Spa',
        description: 'Relaxing treatment',
        duration: 60,
        price: 99.9,
        isActive: true,
      }),
    ).resolves.toEqual({
      success: true,
      message: 'Service created successfully',
      data: {
        id: 'service-id',
        title: 'Spa',
        price: '99.90',
      },
    });

    expect(servicesRepository.create).toHaveBeenCalledWith({
      title: 'Spa',
      description: 'Relaxing treatment',
      duration: 60,
      price: '99.90',
      isActive: true,
    });
  });

  it('returns paginated service results with filters', async () => {
    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getManyAndCount.mockResolvedValue([[{ id: 'service-id' }], 1]);
    servicesRepository.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(
      service.findAll({
        page: 2,
        limit: 5,
        search: 'spa',
        isActive: true,
      }),
    ).resolves.toEqual({
      success: true,
      data: [{ id: 'service-id' }],
      meta: {
        page: 2,
        limit: 5,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });

    expect(queryBuilder.andWhere).toHaveBeenCalledTimes(2);
  });

  it('returns a service by id and throws when missing', async () => {
    servicesRepository.findOne.mockResolvedValueOnce({ id: 'service-id' });

    await expect(service.findOne('service-id')).resolves.toEqual({
      success: true,
      data: { id: 'service-id' },
    });

    servicesRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates services and preserves unchanged fields', async () => {
    servicesRepository.findOne.mockResolvedValueOnce({
      id: 'service-id',
      title: 'Spa',
      description: 'Relaxing treatment',
      duration: 60,
      price: '99.90',
      isActive: true,
    });
    servicesRepository.save.mockResolvedValueOnce({
      id: 'service-id',
      title: 'Spa Plus',
      description: 'Relaxing treatment',
      duration: 75,
      price: '120.00',
      isActive: true,
    });

    await expect(
      service.update('service-id', {
        title: 'Spa Plus',
        duration: 75,
        price: 120,
      }),
    ).resolves.toEqual({
      success: true,
      message: 'Service updated successfully',
      data: {
        id: 'service-id',
        title: 'Spa Plus',
        description: 'Relaxing treatment',
        duration: 75,
        price: '120.00',
        isActive: true,
      },
    });
  });

  it('removes services and throws on missing records', async () => {
    servicesRepository.findOne.mockResolvedValueOnce({ id: 'service-id' });
    servicesRepository.remove.mockResolvedValueOnce(undefined);

    await expect(service.remove('service-id')).resolves.toEqual({
      success: true,
      message: 'Service deleted successfully',
    });

    servicesRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.remove('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('finds an active service entity by id', async () => {
    servicesRepository.findOne.mockResolvedValueOnce({
      id: 'service-id',
      isActive: true,
    });

    await expect(service.findActiveEntityById('service-id')).resolves.toEqual({
      id: 'service-id',
      isActive: true,
    });
  });
  it('uses default pagination when service query parameters are omitted', async () => {
    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
    servicesRepository.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(service.findAll({})).resolves.toEqual({
      success: true,
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    expect(queryBuilder.skip).toHaveBeenCalledWith(0);
    expect(queryBuilder.take).toHaveBeenCalledWith(10);
  });

  it('finds service entities and active entities by id', async () => {
    servicesRepository.findOne
      .mockResolvedValueOnce({ id: 'service-id' })
      .mockResolvedValueOnce({ id: 'active-service-id', isActive: true });

    await expect(service.findEntityById('service-id')).resolves.toEqual({
      id: 'service-id',
    });
    await expect(
      service.findActiveEntityById('active-service-id'),
    ).resolves.toEqual({ id: 'active-service-id', isActive: true });

    expect(servicesRepository.findOne).toHaveBeenNthCalledWith(2, {
      where: {
        id: 'active-service-id',
        isActive: true,
      },
    });
  });

  it('throws when service entity helpers cannot find matching records', async () => {
    servicesRepository.findOne.mockResolvedValue(null);

    await expect(service.findEntityById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    await expect(
      service.findActiveEntityById('inactive'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
