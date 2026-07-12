import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { QueryFailedError } from 'typeorm';

import { Booking } from './entities/booking.entity';
import { BookingStatus } from './enums/booking-status.enum';
import { BookingsService } from './bookings.service';
import { ServicesService } from '../services/services.service';
import {
  createQueryBuilderMock,
  createRepositoryMock,
} from '../testing/test-utils';

describe('BookingsService', () => {
  let service: BookingsService;

  const bookingsRepository = createRepositoryMock();
  const servicesService = {
    findActiveEntityById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingsRepository,
        },
        {
          provide: ServicesService,
          useValue: servicesService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
    bookingsRepository.createQueryBuilder.mockReturnValue(
      createQueryBuilderMock(),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates bookings for active services and normalizes email', async () => {
    servicesService.findActiveEntityById.mockResolvedValue({
      id: 'service-id',
    });
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-01-01T00:00:00Z').getTime());
    bookingsRepository.findOne.mockResolvedValue(null);
    bookingsRepository.create.mockReturnValue({ id: 'booking-id' });
    bookingsRepository.save.mockResolvedValue({
      id: 'booking-id',
      status: BookingStatus.PENDING,
      customerEmail: 'customer@example.com',
    });

    await expect(
      service.create({
        customerName: 'Ada Lovelace',
        customerEmail: ' CUSTOMER@EXAMPLE.COM ',
        customerPhone: '1234567890',
        serviceId: 'service-id',
        bookingDate: '2026-01-02',
        bookingTime: '10:00',
        notes: 'Please call on arrival',
      }),
    ).resolves.toEqual({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: 'booking-id',
        status: BookingStatus.PENDING,
        customerEmail: 'customer@example.com',
      },
    });

    expect(servicesService.findActiveEntityById).toHaveBeenCalledWith(
      'service-id',
    );
    expect(bookingsRepository.create).toHaveBeenCalledWith({
      customerName: 'Ada Lovelace',
      customerEmail: 'customer@example.com',
      customerPhone: '1234567890',
      serviceId: 'service-id',
      bookingDate: '2026-01-02',
      bookingTime: '10:00',
      notes: 'Please call on arrival',
      status: BookingStatus.PENDING,
    });
  });

  it('rejects duplicate booking slots before saving', async () => {
    servicesService.findActiveEntityById.mockResolvedValue({
      id: 'service-id',
    });
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-01-01T00:00:00Z').getTime());
    bookingsRepository.findOne.mockResolvedValue({ id: 'booking-id' });

    await expect(
      service.create({
        customerName: 'Ada Lovelace',
        customerEmail: 'customer@example.com',
        customerPhone: '1234567890',
        serviceId: 'service-id',
        bookingDate: '2026-01-02',
        bookingTime: '10:00',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects invalid or past booking date and time values', async () => {
    servicesService.findActiveEntityById.mockResolvedValue({
      id: 'service-id',
    });

    await expect(
      service.create({
        customerName: 'Ada Lovelace',
        customerEmail: 'customer@example.com',
        customerPhone: '1234567890',
        serviceId: 'service-id',
        bookingDate: 'invalid',
        bookingTime: '10:00',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-01-03T00:00:00Z').getTime());
    await expect(
      service.create({
        customerName: 'Ada Lovelace',
        customerEmail: 'customer@example.com',
        customerPhone: '1234567890',
        serviceId: 'service-id',
        bookingDate: '2026-01-02',
        bookingTime: '10:00',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns paginated bookings with filters and search', async () => {
    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getManyAndCount.mockResolvedValue([[{ id: 'booking-id' }], 1]);
    bookingsRepository.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(
      service.findAll({
        page: 2,
        limit: 5,
        status: BookingStatus.CONFIRMED,
        serviceId: 'service-id',
        customerEmail: 'CUSTOMER@EXAMPLE.COM',
        search: 'Ada',
      }),
    ).resolves.toEqual({
      success: true,
      data: [{ id: 'booking-id' }],
      meta: {
        page: 2,
        limit: 5,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });

    expect(queryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'booking.service',
      'service',
    );
  });

  it('returns booking details and throws when the booking is missing', async () => {
    bookingsRepository.findOne.mockResolvedValueOnce({ id: 'booking-id' });

    await expect(service.findOne('booking-id')).resolves.toEqual({
      success: true,
      data: { id: 'booking-id' },
    });

    bookingsRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates booking status through allowed transitions', async () => {
    bookingsRepository.findOne.mockResolvedValueOnce({
      id: 'booking-id',
      status: BookingStatus.PENDING,
    });
    bookingsRepository.save.mockResolvedValueOnce({
      id: 'booking-id',
      status: BookingStatus.CONFIRMED,
    });

    await expect(
      service.updateStatus('booking-id', BookingStatus.CONFIRMED),
    ).resolves.toEqual({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        id: 'booking-id',
        status: BookingStatus.CONFIRMED,
      },
    });
  });

  it('rejects invalid status transitions and terminal-state changes', async () => {
    bookingsRepository.findOne.mockResolvedValueOnce({
      id: 'booking-id',
      status: BookingStatus.CANCELLED,
    });

    await expect(
      service.updateStatus('booking-id', BookingStatus.CONFIRMED),
    ).rejects.toBeInstanceOf(BadRequestException);

    bookingsRepository.findOne.mockResolvedValueOnce({
      id: 'booking-id',
      status: BookingStatus.PENDING,
    });
    await expect(
      service.updateStatus('booking-id', BookingStatus.COMPLETED),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('cancels active bookings and prevents cancelling terminal ones', async () => {
    bookingsRepository.findOne.mockResolvedValueOnce({
      id: 'booking-id',
      status: BookingStatus.CONFIRMED,
    });
    bookingsRepository.save.mockResolvedValueOnce({
      id: 'booking-id',
      status: BookingStatus.CANCELLED,
    });

    await expect(service.cancel('booking-id')).resolves.toEqual({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        id: 'booking-id',
        status: BookingStatus.CANCELLED,
      },
    });

    bookingsRepository.findOne.mockResolvedValueOnce({
      id: 'booking-id',
      status: BookingStatus.COMPLETED,
    });
    await expect(service.cancel('booking-id')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
  it('maps database unique-constraint races to duplicate booking conflicts', async () => {
    servicesService.findActiveEntityById.mockResolvedValue({
      id: 'service-id',
    });
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-01-01T00:00:00Z').getTime());
    bookingsRepository.findOne.mockResolvedValue(null);
    bookingsRepository.create.mockReturnValue({ id: 'booking-id' });
    bookingsRepository.save.mockRejectedValue(
      new QueryFailedError('INSERT', [], { code: '23505' } as never),
    );

    await expect(
      service.create({
        customerName: 'Ada Lovelace',
        customerEmail: 'customer@example.com',
        customerPhone: '1234567890',
        serviceId: 'service-id',
        bookingDate: '2026-01-02',
        bookingTime: '10:00',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('propagates unexpected persistence errors during booking creation', async () => {
    servicesService.findActiveEntityById.mockResolvedValue({
      id: 'service-id',
    });
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-01-01T00:00:00Z').getTime());
    bookingsRepository.findOne.mockResolvedValue(null);
    bookingsRepository.create.mockReturnValue({ id: 'booking-id' });
    bookingsRepository.save.mockRejectedValue(new Error('database failed'));

    await expect(
      service.create({
        customerName: 'Ada Lovelace',
        customerEmail: 'customer@example.com',
        customerPhone: '1234567890',
        serviceId: 'service-id',
        bookingDate: '2026-01-02',
        bookingTime: '10:00',
      }),
    ).rejects.toThrow('database failed');
  });

  it('marks cancelledAt when status is updated to cancelled', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-01-01T12:00:00Z'));
    const booking = {
      id: 'booking-id',
      status: BookingStatus.PENDING,
      cancelledAt: null,
    };
    bookingsRepository.findOne.mockResolvedValueOnce(booking);
    bookingsRepository.save.mockImplementationOnce(
      (savedBooking: typeof booking) => savedBooking,
    );

    await expect(
      service.updateStatus('booking-id', BookingStatus.CANCELLED),
    ).resolves.toEqual({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        id: 'booking-id',
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date('2026-01-01T12:00:00Z'),
      },
    });

    expect(bookingsRepository.save).toHaveBeenCalledWith({
      id: 'booking-id',
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date('2026-01-01T12:00:00Z'),
    });
    jest.useRealTimers();
  });

  it('rejects same-state status updates and missing bookings', async () => {
    bookingsRepository.findOne.mockResolvedValueOnce({
      id: 'booking-id',
      status: BookingStatus.PENDING,
    });

    await expect(
      service.updateStatus('booking-id', BookingStatus.PENDING),
    ).rejects.toBeInstanceOf(BadRequestException);

    bookingsRepository.findOne.mockResolvedValueOnce(null);
    await expect(
      service.updateStatus('missing', BookingStatus.CONFIRMED),
    ).rejects.toBeInstanceOf(NotFoundException);

    bookingsRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.cancel('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
