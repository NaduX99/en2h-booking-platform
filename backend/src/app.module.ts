import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,

        host: configService.get<string>('DATABASE_HOST'),

        port: Number(
          configService.get<string>('DATABASE_PORT'),
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

        synchronize: true,

        logging: false,
      }),
    }),

    UsersModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule { }