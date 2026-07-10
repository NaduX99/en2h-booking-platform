import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    @Throttle({
        default: {
            limit: 3,
            ttl: 60_000,
            blockDuration: 600_000,
        },
    })
    register(
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.register(
            registerDto,
        );
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({
        default: {
            limit: 5,
            ttl: 60_000,
            blockDuration: 300_000,
        },
    })
    login(
        @Body() loginDto: LoginDto,
    ) {
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @Throttle({
        default: {
            limit: 10,
            ttl: 60_000,
            blockDuration: 120_000,
        },
    })
    refresh(
        @Body() dto: RefreshTokenDto,
    ) {
        return this.authService.refresh(
            dto.refreshToken,
        );
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @Throttle({
        default: {
            limit: 10,
            ttl: 60_000,
        },
    })
    logout(
        @Body() dto: LogoutDto,
    ) {
        return this.authService.logout(
            dto.refreshToken,
        );
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(
        @CurrentUser()
        user: {
            id: string;
            name: string;
            email: string;
        },
    ) {
        return {
            success: true,
            data: user,
        };
    }
}