import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    updateRefreshTokenHash: jest.fn(),
    findByIdWithRefreshToken: jest.fn(),
  };

  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const configService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService.getOrThrow.mockImplementation((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') {
        return 'access-secret';
      }

      if (key === 'JWT_REFRESH_SECRET') {
        return 'refresh-secret';
      }

      return key;
    });
    configService.get.mockImplementation((key: string) => {
      if (key === 'JWT_ACCESS_EXPIRES_IN') {
        return '15m';
      }

      if (key === 'JWT_REFRESH_EXPIRES_IN') {
        return '7d';
      }

      return undefined;
    });
    jest.clearAllMocks();
  });

  it('registers a new user with a hashed password', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    usersService.create.mockResolvedValue({
      id: 'user-id',
      name: 'Ada',
      email: 'ada@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    await expect(
      service.register({
        name: 'Ada',
        email: ' ADA@Example.com ',
        password: 'Password123!',
      }),
    ).resolves.toEqual({
      success: true,
      message: 'Registration successful',
      data: {
        id: 'user-id',
        name: 'Ada',
        email: 'ada@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    });

    expect(usersService.findByEmail).toHaveBeenCalledWith('ada@example.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 12);
    expect(usersService.create).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      passwordHash: 'hashed-password',
    });
  });

  it('rejects duplicate registration emails', async () => {
    usersService.findByEmail.mockResolvedValue({ id: 'existing-user' });

    await expect(
      service.register({
        name: 'Ada',
        email: 'ada@example.com',
        password: 'Password123!',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in a user and stores the rotated refresh token', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      name: 'Ada',
      email: 'ada@example.com',
      passwordHash: 'hashed-password',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');
    (bcrypt.hash as jest.Mock).mockResolvedValue('refresh-hash');

    await expect(
      service.login({
        email: 'ada@example.com',
        password: 'Password123!',
      }),
    ).resolves.toEqual({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
        accessTokenExpiresIn: '15m',
        refreshTokenExpiresIn: '7d',
        user: {
          id: 'user-id',
          name: 'Ada',
          email: 'ada@example.com',
        },
      },
    });

    expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
      'user-id',
      'refresh-hash',
    );
  });

  it('rejects login when the email is unknown', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'unknown@example.com', password: 'Password123!' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('refreshes tokens and rotates the stored refresh hash', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-id',
      email: 'ada@example.com',
      tokenType: 'refresh',
    });
    usersService.findByIdWithRefreshToken.mockResolvedValue({
      id: 'user-id',
      email: 'ada@example.com',
      refreshTokenHash: 'stored-refresh-hash',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync
      .mockResolvedValueOnce('new-access-token')
      .mockResolvedValueOnce('new-refresh-token');
    (bcrypt.hash as jest.Mock).mockResolvedValue('new-refresh-hash');

    await expect(service.refresh('old-refresh-token')).resolves.toEqual({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer',
        accessTokenExpiresIn: '15m',
        refreshTokenExpiresIn: '7d',
      },
    });

    expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
      'user-id',
      'new-refresh-hash',
    );
  });

  it('rejects refresh tokens that are not valid anymore', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-id',
      email: 'ada@example.com',
      tokenType: 'refresh',
    });
    usersService.findByIdWithRefreshToken.mockResolvedValue({
      id: 'user-id',
      email: 'ada@example.com',
      refreshTokenHash: 'stored-refresh-hash',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.refresh('old-refresh-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('logs out by clearing the stored refresh token hash', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-id',
      email: 'ada@example.com',
      tokenType: 'refresh',
    });
    usersService.findByIdWithRefreshToken.mockResolvedValue({
      id: 'user-id',
      email: 'ada@example.com',
      refreshTokenHash: 'stored-refresh-hash',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(service.logout('refresh-token')).resolves.toEqual({
      success: true,
      message: 'Logout successful',
    });

    expect(usersService.updateRefreshTokenHash).toHaveBeenCalledWith(
      'user-id',
      null,
    );
  });

  it('returns success when logging out an already-cleared session', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-id',
      email: 'ada@example.com',
      tokenType: 'refresh',
    });
    usersService.findByIdWithRefreshToken.mockResolvedValue({
      id: 'user-id',
      email: 'ada@example.com',
      refreshTokenHash: null,
    });

    await expect(service.logout('refresh-token')).resolves.toEqual({
      success: true,
      message: 'Logout successful',
    });

    expect(usersService.updateRefreshTokenHash).not.toHaveBeenCalled();
  });
  it('rejects login when the password is incorrect without issuing tokens', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      name: 'Ada',
      email: 'ada@example.com',
      passwordHash: 'hashed-password',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'ada@example.com', password: 'WrongPass123!' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(jwtService.signAsync).not.toHaveBeenCalled();
    expect(usersService.updateRefreshTokenHash).not.toHaveBeenCalled();
  });

  it('rejects invalid refresh JWTs and non-refresh token payloads', async () => {
    jwtService.verifyAsync.mockRejectedValueOnce(new Error('expired'));

    await expect(
      service.refresh('expired-refresh-token'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: 'user-id',
      email: 'ada@example.com',
      tokenType: 'access',
    });

    await expect(service.refresh('access-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects refresh when the user or stored refresh hash is missing', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-id',
      email: 'ada@example.com',
      tokenType: 'refresh',
    });
    usersService.findByIdWithRefreshToken
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'user-id',
        email: 'ada@example.com',
        refreshTokenHash: null,
      });

    await expect(service.refresh('refresh-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    await expect(service.refresh('refresh-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects invalid logout tokens and mismatched refresh hashes', async () => {
    jwtService.verifyAsync.mockRejectedValueOnce(new Error('bad token'));

    await expect(service.logout('bad-refresh-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    jwtService.verifyAsync.mockResolvedValueOnce({
      sub: 'user-id',
      email: 'ada@example.com',
      tokenType: 'refresh',
    });
    usersService.findByIdWithRefreshToken.mockResolvedValueOnce({
      id: 'user-id',
      email: 'ada@example.com',
      refreshTokenHash: 'stored-refresh-hash',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(service.logout('wrong-refresh-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );

    expect(usersService.updateRefreshTokenHash).not.toHaveBeenCalled();
  });
});
