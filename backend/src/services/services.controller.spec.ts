import { Test, TestingModule } from '@nestjs/testing';

import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

describe('ServicesController', () => {
  let controller: ServicesController;

  const servicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: servicesService,
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    jest.clearAllMocks();
  });

  it('delegates create to the service layer', () => {
    const dto = {
      title: 'Premium',
      description: 'Service description',
      duration: 60,
      price: 99.99,
      isActive: true,
    };
    servicesService.create.mockReturnValue({ success: true });

    expect(controller.create(dto as never)).toEqual({ success: true });
    expect(servicesService.create).toHaveBeenCalledWith(dto);
  });

  it('forces public active service queries to active only', () => {
    servicesService.findAll.mockReturnValue({ success: true });

    expect(controller.findPublicActive({ search: 'spa' } as never)).toEqual({
      success: true,
    });
    expect(servicesService.findAll).toHaveBeenCalledWith({
      search: 'spa',
      isActive: true,
    });
  });

  it('delegates service lookup and mutation methods', () => {
    servicesService.findAll.mockReturnValue({ success: true });
    servicesService.findOne.mockReturnValue({ success: true });
    servicesService.update.mockReturnValue({ success: true });
    servicesService.remove.mockReturnValue({ success: true });

    expect(controller.findAll({ page: 2 } as never)).toEqual({ success: true });
    expect(controller.findOne('id')).toEqual({ success: true });
    expect(controller.update('id', { title: 'Updated' } as never)).toEqual({
      success: true,
    });
    expect(controller.remove('id')).toEqual({ success: true });
  });
});
