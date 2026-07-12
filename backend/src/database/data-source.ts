import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Booking } from '../bookings/entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DATABASE_HOST,

  port: Number(process.env.DATABASE_PORT ?? 5432),

  username: process.env.DATABASE_USERNAME,

  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,

  entities: [User, Service, Booking],

  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,

  logging: false,
});

export default AppDataSource;
