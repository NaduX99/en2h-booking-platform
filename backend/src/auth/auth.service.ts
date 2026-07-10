import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();

        const existingUser =
            await this.usersService.findByEmail(email);

        if (existingUser) {
            throw new ConflictException(
                'Email is already registered',
            );
        }

        const passwordHash = await bcrypt.hash(
            dto.password,
            12,
        );

        const user = await this.usersService.create({
            name: dto.name,
            email,
            passwordHash,
        });

        return {
            success: true,
            message: 'Registration successful',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }

    async login(dto: LoginDto) {
        const user =
            await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const passwordMatches = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!passwordMatches) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const tokens = await this.generateTokens(
            user.id,
            user.email,
        );

        await this.storeRefreshToken(
            user.id,
            tokens.refreshToken,
        );

        return {
            success: true,
            message: 'Login successful',
            data: {
                ...tokens,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
        };
    }

    async refresh(refreshToken: string) {
        let payload: JwtPayload;

        try {
            payload =
                await this.jwtService.verifyAsync<JwtPayload>(
                    refreshToken,
                    {
                        secret:
                            this.configService.getOrThrow<string>(
                                'JWT_REFRESH_SECRET',
                            ),
                    },
                );
        } catch {
            throw new UnauthorizedException(
                'Invalid or expired refresh token',
            );
        }

        if (payload.tokenType !== 'refresh') {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        const user =
            await this.usersService.findByIdWithRefreshToken(
                payload.sub,
            );

        if (!user || !user.refreshTokenHash) {
            throw new UnauthorizedException(
                'Refresh token is no longer valid',
            );
        }

        const refreshTokenMatches =
            await bcrypt.compare(
                refreshToken,
                user.refreshTokenHash,
            );

        if (!refreshTokenMatches) {
            throw new UnauthorizedException(
                'Refresh token is no longer valid',
            );
        }

        const tokens = await this.generateTokens(
            user.id,
            user.email,
        );

        // Token rotation: replace the old refresh token hash.
        await this.storeRefreshToken(
            user.id,
            tokens.refreshToken,
        );

        return {
            success: true,
            message: 'Tokens refreshed successfully',
            data: tokens,
        };
    }

    async logout(refreshToken: string) {
        let payload: JwtPayload;

        try {
            payload =
                await this.jwtService.verifyAsync<JwtPayload>(
                    refreshToken,
                    {
                        secret:
                            this.configService.getOrThrow<string>(
                                'JWT_REFRESH_SECRET',
                            ),
                        ignoreExpiration: true,
                    },
                );
        } catch {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        const user =
            await this.usersService.findByIdWithRefreshToken(
                payload.sub,
            );

        if (!user || !user.refreshTokenHash) {
            return {
                success: true,
                message: 'Logout successful',
            };
        }

        const refreshTokenMatches =
            await bcrypt.compare(
                refreshToken,
                user.refreshTokenHash,
            );

        if (!refreshTokenMatches) {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
        }

        await this.usersService.updateRefreshTokenHash(
            user.id,
            null,
        );

        return {
            success: true,
            message: 'Logout successful',
        };
    }

    private async generateTokens(
        userId: string,
        email: string,
    ) {
        const accessPayload: JwtPayload = {
            sub: userId,
            email,
            tokenType: 'access',
        };

        const refreshPayload: JwtPayload = {
            sub: userId,
            email,
            tokenType: 'refresh',
        };

        const accessExpiresIn =
            this.configService.get<string>(
                'JWT_ACCESS_EXPIRES_IN',
            ) ?? '15m';

        const refreshExpiresIn =
            this.configService.get<string>(
                'JWT_REFRESH_EXPIRES_IN',
            ) ?? '7d';

        const [accessToken, refreshToken] =
            await Promise.all([
                this.jwtService.signAsync(
                    accessPayload,
                    {
                        secret:
                            this.configService.getOrThrow<string>(
                                'JWT_ACCESS_SECRET',
                            ),
                        expiresIn:
                            accessExpiresIn as StringValue,
                    },
                ),

                this.jwtService.signAsync(
                    refreshPayload,
                    {
                        secret:
                            this.configService.getOrThrow<string>(
                                'JWT_REFRESH_SECRET',
                            ),
                        expiresIn:
                            refreshExpiresIn as StringValue,
                    },
                ),
            ]);

        return {
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
            accessTokenExpiresIn: accessExpiresIn,
            refreshTokenExpiresIn: refreshExpiresIn,
        };
    }

    private async storeRefreshToken(
        userId: string,
        refreshToken: string,
    ) {
        const refreshTokenHash =
            await bcrypt.hash(refreshToken, 12);

        await this.usersService.updateRefreshTokenHash(
            userId,
            refreshTokenHash,
        );
    }
}