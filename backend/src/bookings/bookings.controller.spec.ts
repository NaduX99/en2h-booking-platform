import { Test, TestingModule } from '@nestjs/testing';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;

  const bookingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateStatus: jest.fn(),
    cancel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: bookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    jest.clearAllMocks();
  });

  it('forces the authenticated email into booking creation payloads', () => {
    bookingsService.create.mockReturnValue({ success: true });
    const dto = {
      customerName: 'Ada Lovelace',
      customerEmail: 'guest@example.com',
      customerPhone: '1234567890',
      serviceId: 'service-id',
      bookingDate: '2026-01-10',
      bookingTime: '10:00',
    };

    expect(
      controller.create(dto as never, {
        sub: 'user-id',
        email: 'customer@example.com',
      } as never),
    ).toEqual({ success: true });
    expect(bookingsService.create).toHaveBeenCalledWith({
      ...dto,
      customerEmail: 'customer@example.com',
    });
  });

  it('restricts customer booking queries to their own email', () => {
    bookingsService.findAll.mockReturnValue({ success: true });
    const query = { search: 'Ada' };

    expect(
      controller.findAll(query as never, {
        sub: 'user-id',
        email: 'customer@example.com',
      } as never),
    ).toEqual({ success: true });
    expect(bookingsService.findAll).toHaveBeenCalledWith({
      search: 'Ada',
      customerEmail: 'customer@example.com',
    });
  });

  it('leaves staff booking queries unrestricted', () => {
    bookingsService.findAll.mockReturnValue({ success: true });

    expect(
      controller.findAll({ page: 1 } as never, {
        sub: 'admin-id',
        email: 'admin@en2h.com',
      } as never),
    ).toEqual({ success: true });
    expect(bookingsService.findAll).toHaveBeenCalledWith({ page: 1 });
  });

  it('delegates booking detail and status mutations', () => {
    bookingsService.findOne.mockReturnValue({ success: true });
    bookingsService.updateStatus.mockReturnValue({ success: true });
    bookingsService.cancel.mockReturnValue({ success: true });

    expect(controller.findOne('booking-id')).toEqual({ success: true });
    expect(
      controller.updateStatus('booking-id', { status: 'CONFIRMED' } as never),
    ).toEqual({ success: true });
    expect(controller.cancel('booking-id')).toEqual({ success: true });
  });
});
