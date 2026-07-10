import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
} from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 100,
        blockDuration: 60_000,
      },
    ]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,

        host: configService.get<string>(
          'DATABASE_HOST',
        ),

        port: Number(
          configService.get<string>(
            'DATABASE_PORT',
          ),
        ),

        username: configService.get<string>(
          'DATABASE_USERNAME',
        ),

        password: configService.get<string>(
          'DATABASE_PASSWORD',
        ),

        database: configService.get<string>(
          'DATABASE_NAME',
        ),

        autoLoadEntities: true,
        synchronize: false,
        logging: false,
      }),
    }),

    UsersModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }