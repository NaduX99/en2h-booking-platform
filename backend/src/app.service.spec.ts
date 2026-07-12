import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  const dataSource = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    jest.clearAllMocks();
  });

  it('returns api information', () => {
    expect(service.getApiInfo()).toEqual({
      success: true,
      message: 'EN2H Booking Platform API',
      version: '1.0.0',
    });
  });

  it('returns healthy status when the database responds', async () => {
    dataSource.query.mockResolvedValue([{ '?column?': 1 }]);

    const result = await service.getHealth();

    expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
    expect(result).toMatchObject({
      success: true,
      status: 'ok',
      api: 'running',
      database: 'connected',
    });
    expect(result.timestamp).toEqual(expect.any(String));
  });

  it('throws a service unavailable exception when the database query fails', async () => {
    dataSource.query.mockRejectedValue(new Error('database down'));

    await expect(service.getHealth()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
