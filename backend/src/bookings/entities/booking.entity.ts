import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Service } from '../../services/entities/service.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity('bookings')
@Unique('UQ_booking_service_date_time', [
  'serviceId',
  'bookingDate',
  'bookingTime',
])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 100,
  })
  customerName: string;

  @Index()
  @Column({
    name: 'customer_email',
    type: 'varchar',
    length: 150,
  })
  customerEmail: string;

  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 30,
  })
  customerPhone: string;

  @Index()
  @Column({
    name: 'service_id',
    type: 'uuid',
  })
  serviceId: string;

  @ManyToOne(() => Service, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'service_id',
  })
  service: Service;

  @Index()
  @Column({
    name: 'booking_date',
    type: 'date',
  })
  bookingDate: string;

  @Column({
    name: 'booking_time',
    type: 'time',
  })
  bookingTime: string;

  @Index()
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string | null;

  @Column({
    name: 'cancelled_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  cancelledAt?: Date | null;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
