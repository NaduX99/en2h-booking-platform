import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('delegates registration to the auth service', () => {
    const dto = {
      name: 'Ada',
      email: 'ada@example.com',
      password: 'Password123!',
    };
    authService.register.mockReturnValue({ success: true });

    expect(controller.register(dto as never)).toEqual({ success: true });
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('delegates login to the auth service', () => {
    const dto = {
      email: 'ada@example.com',
      password: 'Password123!',
    };
    authService.login.mockReturnValue({ success: true });

    expect(controller.login(dto as never)).toEqual({ success: true });
    expect(authService.login).toHaveBeenCalledWith(dto);
  });

  it('delegates refresh and logout to the auth service', () => {
    authService.refresh.mockReturnValue({ success: true });
    authService.logout.mockReturnValue({ success: true });

    expect(
      controller.refresh({ refreshToken: 'refresh-token' } as never),
    ).toEqual({ success: true });
    expect(
      controller.logout({ refreshToken: 'refresh-token' } as never),
    ).toEqual({ success: true });

    expect(authService.refresh).toHaveBeenCalledWith('refresh-token');
    expect(authService.logout).toHaveBeenCalledWith('refresh-token');
  });

  it('returns the current user profile', () => {
    const user = { id: '1', name: 'Ada', email: 'ada@example.com' };

    expect(controller.getProfile(user)).toEqual({
      success: true,
      data: user,
    });
  });
});
