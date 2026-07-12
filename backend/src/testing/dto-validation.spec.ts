import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { LoginDto } from '../auth/dto/login.dto';
import { LogoutDto } from '../auth/dto/logout.dto';
import { RefreshTokenDto } from '../auth/dto/refresh-token.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { BookingQueryDto } from '../bookings/dto/booking-query.dto';
import { CreateBookingDto } from '../bookings/dto/create-booking.dto';
import { UpdateBookingStatusDto } from '../bookings/dto/update-booking-status.dto';
import { BookingStatus } from '../bookings/enums/booking-status.enum';
import { CreateServiceDto } from '../services/dto/create-service.dto';
import { ServiceQueryDto } from '../services/dto/service-query.dto';
import { UpdateServiceDto } from '../services/dto/update-service.dto';

async function validatePayload<T extends object>(
  dtoClass: new () => T,
  payload: Record<string, unknown>,
) {
  return validate(plainToInstance(dtoClass, payload), {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
}

function errorProperties(errors: Awaited<ReturnType<typeof validatePayload>>) {
  return errors.map((error) => error.property);
}

describe('DTO validation contracts', () => {
  describe('auth DTOs', () => {
    it('accepts valid registration, login, refresh, and logout payloads', async () => {
      await expect(
        validatePayload(RegisterDto, {
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          password: 'Password123!',
        }),
      ).resolves.toHaveLength(0);

      await expect(
        validatePayload(LoginDto, {
          email: 'ada@example.com',
          password: 'Password123!',
        }),
      ).resolves.toHaveLength(0);

      await expect(
        validatePayload(RefreshTokenDto, {
          refreshToken: 'refresh-token',
        }),
      ).resolves.toHaveLength(0);

      await expect(
        validatePayload(LogoutDto, {
          refreshToken: 'refresh-token',
        }),
      ).resolves.toHaveLength(0);
    });

    it('rejects invalid or missing auth fields', async () => {
      await expect(
        validatePayload(RegisterDto, {
          email: 'not-an-email',
          password: 'short',
          extra: 'blocked',
        }),
      ).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ property: 'name' }),
          expect.objectContaining({ property: 'email' }),
          expect.objectContaining({ property: 'password' }),
          expect.objectContaining({ property: 'extra' }),
        ]),
      );

      const loginErrors = await validatePayload(LoginDto, {
        email: 'not-an-email',
      });

      expect(errorProperties(loginErrors)).toEqual(
        expect.arrayContaining(['email', 'password']),
      );

      await expect(validatePayload(RefreshTokenDto, {})).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ property: 'refreshToken' }),
        ]),
      );
    });
  });

  describe('service DTOs', () => {
    it('accepts valid create, update, and query service payloads', async () => {
      await expect(
        validatePayload(CreateServiceDto, {
          title: 'Premium Consultation',
          description: 'One hour of specialist support.',
          duration: 60,
          price: 120.5,
          isActive: true,
        }),
      ).resolves.toHaveLength(0);

      await expect(
        validatePayload(UpdateServiceDto, {
          title: 'Premium Consultation Plus',
          price: 150,
          isActive: false,
        }),
      ).resolves.toHaveLength(0);

      const query = plainToInstance(ServiceQueryDto, {
        page: '2',
        limit: '20',
        isActive: 'true',
        search: 'consult',
      });

      await expect(validate(query)).resolves.toHaveLength(0);
      expect(query).toMatchObject({
        page: 2,
        limit: 20,
        isActive: true,
        search: 'consult',
      });
    });

    it('rejects invalid service fields and query limits', async () => {
      const createErrors = await validatePayload(CreateServiceDto, {
        title: '',
        description: '',
        duration: 0,
        price: 10.123,
        isActive: 'yes',
      });

      expect(errorProperties(createErrors)).toEqual(
        expect.arrayContaining([
          'title',
          'description',
          'duration',
          'price',
          'isActive',
        ]),
      );

      const query = plainToInstance(ServiceQueryDto, {
        page: '0',
        limit: '101',
        isActive: 'sometimes',
      });
      const queryErrors = await validate(query);

      expect(errorProperties(queryErrors)).toEqual(
        expect.arrayContaining(['page', 'limit', 'isActive']),
      );
    });
  });

  describe('booking DTOs', () => {
    it('accepts valid booking creation, query, and status payloads', async () => {
      await expect(
        validatePayload(CreateBookingDto, {
          customerName: 'Ada Lovelace',
          customerEmail: 'ada@example.com',
          customerPhone: '+15551234567',
          serviceId: '7a45fc64-46b8-4e0a-b76b-229144d2a400',
          bookingDate: '2026-08-01',
          bookingTime: '14:30',
          notes: 'Prefers morning reminder.',
        }),
      ).resolves.toHaveLength(0);

      await expect(
        validatePayload(BookingQueryDto, {
          page: 1,
          limit: 10,
          status: BookingStatus.PENDING,
          serviceId: '7a45fc64-46b8-4e0a-b76b-229144d2a400',
          customerEmail: 'ada@example.com',
        }),
      ).resolves.toHaveLength(0);

      await expect(
        validatePayload(UpdateBookingStatusDto, {
          status: BookingStatus.CONFIRMED,
        }),
      ).resolves.toHaveLength(0);
    });

    it('rejects invalid booking fields, filters, and status values', async () => {
      const createErrors = await validatePayload(CreateBookingDto, {
        customerName: '',
        customerEmail: 'invalid',
        customerPhone: '',
        serviceId: 'not-a-uuid',
        bookingDate: 'tomorrow',
        bookingTime: '25:99',
      });

      expect(errorProperties(createErrors)).toEqual(
        expect.arrayContaining([
          'customerName',
          'customerEmail',
          'customerPhone',
          'serviceId',
          'bookingDate',
          'bookingTime',
        ]),
      );

      const queryErrors = await validatePayload(BookingQueryDto, {
        page: 0,
        limit: 101,
        status: 'RESCHEDULED',
        serviceId: 'not-a-uuid',
      });

      expect(errorProperties(queryErrors)).toEqual(
        expect.arrayContaining(['page', 'limit', 'status', 'serviceId']),
      );

      await expect(
        validatePayload(UpdateBookingStatusDto, {
          status: 'RESCHEDULED',
        }),
      ).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ property: 'status' }),
        ]),
      );
    });
  });
});
