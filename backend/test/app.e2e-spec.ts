import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import request from 'supertest';
import type { App } from 'supertest/types';

import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { BookingsController } from '../src/bookings/bookings.controller';
import { BookingStatus } from '../src/bookings/enums/booking-status.enum';
import { BookingsService } from '../src/bookings/bookings.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { ServicesController } from '../src/services/services.controller';
import { ServicesService } from '../src/services/services.service';

type TestUser = {
  id: string;
  name: string;
  email: string;
};

type HealthResponse = {
  timestamp: string;
};

type ValidationErrorResponse = {
  message: unknown;
};

function httpServer(app: INestApplication): App {
  return app.getHttpServer() as App;
}

const authenticatedUser: TestUser = {
  id: 'user-id',
  name: 'Ada Lovelace',
  email: 'customer@example.com',
};

const staffUser: TestUser = {
  id: 'staff-id',
  name: 'EN2H Staff',
  email: 'admin@en2h.com',
};

function createMocks() {
  return {
    appService: {
      getApiInfo: jest.fn().mockReturnValue({
        success: true,
        message: 'EN2H Booking Platform API',
        version: '1.0.0',
      }),
      getHealth: jest.fn().mockResolvedValue({
        success: true,
        status: 'ok',
        api: 'running',
        database: 'connected',
        timestamp: '2026-01-01T00:00:00.000Z',
      }),
    },
    authService: {
      register: jest.fn().mockResolvedValue({ success: true }),
      login: jest.fn().mockResolvedValue({ success: true }),
      refresh: jest.fn().mockResolvedValue({ success: true }),
      logout: jest.fn().mockResolvedValue({ success: true }),
    },
    servicesService: {
      create: jest.fn().mockResolvedValue({ success: true }),
      findAll: jest.fn().mockResolvedValue({ success: true, data: [] }),
      findOne: jest.fn().mockResolvedValue({ success: true }),
      update: jest.fn().mockResolvedValue({ success: true }),
      remove: jest.fn().mockResolvedValue({ success: true }),
    },
    bookingsService: {
      create: jest.fn().mockResolvedValue({ success: true }),
      findAll: jest.fn().mockResolvedValue({ success: true, data: [] }),
      findOne: jest.fn().mockResolvedValue({ success: true }),
      updateStatus: jest.fn().mockResolvedValue({ success: true }),
      cancel: jest.fn().mockResolvedValue({ success: true }),
    },
  };
}

async function createApp(options: { user?: TestUser } = {}) {
  const mocks = createMocks();
  const builder = Test.createTestingModule({
    controllers: [
      AppController,
      AuthController,
      ServicesController,
      BookingsController,
    ],
    providers: [
      { provide: AppService, useValue: mocks.appService },
      { provide: AuthService, useValue: mocks.authService },
      { provide: ServicesService, useValue: mocks.servicesService },
      { provide: BookingsService, useValue: mocks.bookingsService },
    ],
  });

  if (options.user) {
    builder.overrideGuard(JwtAuthGuard).useValue({
      canActivate: (context: {
        switchToHttp: () => { getRequest: () => Request & { user?: TestUser } };
      }) => {
        context.switchToHttp().getRequest().user = options.user;
        return true;
      },
    });
  }

  const moduleFixture: TestingModule = await builder.compile();
  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();

  return { app, mocks };
}

describe('EN2H API route automation (e2e)', () => {
  let app: INestApplication;

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    jest.clearAllMocks();
  });

  it('BE-HLT-001/002/004 returns API info and healthy dependency status', async () => {
    const setup = await createApp();
    app = setup.app;

    await request(httpServer(app)).get('/api/v1').expect(200).expect({
      success: true,
      message: 'EN2H Booking Platform API',
      version: '1.0.0',
    });

    await request(httpServer(app))
      .get('/api/v1/health')
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          success: true,
          status: 'ok',
          api: 'running',
          database: 'connected',
        });
        const body = response.body as HealthResponse;
        expect(Date.parse(body.timestamp)).not.toBeNaN();
      });
  });

  it('BE-REG and BE-LGN validates auth payloads before delegation', async () => {
    const setup = await createApp();
    app = setup.app;

    await request(httpServer(app))
      .post('/api/v1/auth/register')
      .send({
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'Password123!',
      })
      .expect(201)
      .expect({ success: true });

    expect(setup.mocks.authService.register).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'Password123!',
    });

    await request(httpServer(app))
      .post('/api/v1/auth/register')
      .send({ email: 'invalid', password: 'short', role: 'admin' })
      .expect(400)
      .expect((response) => {
        expect(response.body).toMatchObject({
          success: false,
          statusCode: 400,
          path: '/api/v1/auth/register',
          method: 'POST',
        });
        const body = response.body as ValidationErrorResponse;
        expect(body.message).toEqual(expect.any(Array));
      });

    await request(httpServer(app))
      .post('/api/v1/auth/login')
      .send({ email: 'ada@example.com', password: 'Password123!' })
      .expect(200)
      .expect({ success: true });

    await request(httpServer(app))
      .post('/api/v1/auth/login')
      .send({ email: 'invalid' })
      .expect(400);
  });

  it('BE-RFR and BE-LGO validates refresh-token request bodies', async () => {
    const setup = await createApp();
    app = setup.app;

    await request(httpServer(app))
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'refresh-token' })
      .expect(200)
      .expect({ success: true });
    expect(setup.mocks.authService.refresh).toHaveBeenCalledWith(
      'refresh-token',
    );

    await request(httpServer(app))
      .post('/api/v1/auth/refresh')
      .send({})
      .expect(400);

    await request(httpServer(app))
      .post('/api/v1/auth/logout')
      .send({ refreshToken: 'refresh-token' })
      .expect(200)
      .expect({ success: true });
    expect(setup.mocks.authService.logout).toHaveBeenCalledWith(
      'refresh-token',
    );

    await request(httpServer(app))
      .post('/api/v1/auth/logout')
      .send({})
      .expect(400);
  });

  it('BE-PSV returns public active services without authentication', async () => {
    const setup = await createApp();
    app = setup.app;

    await request(httpServer(app))
      .get('/api/v1/services/public/active?search=consult&limit=5')
      .expect(200)
      .expect({ success: true, data: [] });

    expect(setup.mocks.servicesService.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 5,
      search: 'consult',
      isActive: true,
    });
  });

  it('BE-SVC and BE-SVL validate protected service management requests', async () => {
    const setup = await createApp({ user: staffUser });
    app = setup.app;
    const serviceId = '7a45fc64-46b8-4e0a-b76b-229144d2a400';

    await request(httpServer(app))
      .post('/api/v1/services')
      .send({
        title: 'Premium Consultation',
        description: 'One hour support.',
        duration: 60,
        price: 120,
        isActive: true,
      })
      .expect(201)
      .expect({ success: true });

    await request(httpServer(app))
      .post('/api/v1/services')
      .send({ title: '', price: -1 })
      .expect(400);

    await request(httpServer(app))
      .get('/api/v1/services?page=2&limit=5&isActive=false')
      .expect(200);
    expect(setup.mocks.servicesService.findAll).toHaveBeenCalledWith({
      page: 2,
      limit: 5,
      isActive: false,
    });

    await request(httpServer(app))
      .get(`/api/v1/services/${serviceId}`)
      .expect(200);
    await request(httpServer(app))
      .patch(`/api/v1/services/${serviceId}`)
      .send({ price: 150 })
      .expect(200);
    await request(httpServer(app))
      .delete(`/api/v1/services/${serviceId}`)
      .expect(200);
    await request(httpServer(app))
      .get('/api/v1/services/not-a-uuid')
      .expect(400);
  });

  it('BE-BKC/BKL/BKD/BKS/BKX validates protected booking workflows', async () => {
    const setup = await createApp({ user: authenticatedUser });
    app = setup.app;
    const serviceId = '7a45fc64-46b8-4e0a-b76b-229144d2a400';
    const bookingId = 'b8160ba2-f32e-404d-820d-c8727d4af638';

    await request(httpServer(app))
      .post('/api/v1/bookings')
      .send({
        customerName: 'Ada Lovelace',
        customerEmail: 'spoof@example.com',
        customerPhone: '+15551234567',
        serviceId,
        bookingDate: '2026-08-01',
        bookingTime: '14:30',
      })
      .expect(201)
      .expect({ success: true });
    expect(setup.mocks.bookingsService.create).toHaveBeenCalledWith(
      expect.objectContaining({ customerEmail: authenticatedUser.email }),
    );

    await request(httpServer(app))
      .post('/api/v1/bookings')
      .send({ serviceId, bookingDate: 'bad', bookingTime: '99:99' })
      .expect(400);

    await request(httpServer(app))
      .get('/api/v1/bookings?status=PENDING&search=Ada')
      .expect(200);
    expect(setup.mocks.bookingsService.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: 'Ada',
      status: BookingStatus.PENDING,
      customerEmail: authenticatedUser.email,
    });

    await request(httpServer(app))
      .get(`/api/v1/bookings/${bookingId}`)
      .expect(200);
    await request(httpServer(app))
      .patch(`/api/v1/bookings/${bookingId}/status`)
      .send({ status: BookingStatus.CONFIRMED })
      .expect(200);
    await request(httpServer(app))
      .patch(`/api/v1/bookings/${bookingId}/cancel`)
      .expect(200);
    await request(httpServer(app))
      .patch(`/api/v1/bookings/${bookingId}/status`)
      .send({ status: 'RESCHEDULED' })
      .expect(400);
  });
});
