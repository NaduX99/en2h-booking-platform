import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const appService = {
    getApiInfo: jest.fn(),
    getHealth: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    jest.clearAllMocks();
  });

  it('returns api info from the app service', () => {
    const apiInfo = { success: true, message: 'EN2H Booking Platform API' };
    appService.getApiInfo.mockReturnValue(apiInfo);

    expect(appController.getApiInfo()).toBe(apiInfo);
    expect(appService.getApiInfo).toHaveBeenCalledTimes(1);
  });

  it('returns health data from the app service', async () => {
    const health = {
      success: true,
      status: 'ok',
      api: 'running',
      database: 'connected',
      timestamp: '2026-01-01T00:00:00.000Z',
    };
    appService.getHealth.mockResolvedValue(health);

    await expect(appController.getHealth()).resolves.toBe(health);
    expect(appService.getHealth).toHaveBeenCalledTimes(1);
  });
});