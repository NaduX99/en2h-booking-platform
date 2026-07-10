import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser =
            await this.usersService.findByEmail(dto.email);

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
            email: dto.email,
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

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        return {
            success: true,
            message: 'Login successful',
            data: {
                accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
        };
    }
}