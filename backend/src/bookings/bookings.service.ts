import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { ServicesService } from '../services/services.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingsRepository:
            Repository<Booking>,

        private readonly servicesService:
            ServicesService,
    ) { }

    async create(
        createBookingDto: CreateBookingDto,
    ) {
        await this.servicesService.findActiveEntityById(
            createBookingDto.serviceId,
        );

        this.validateFutureBooking(
            createBookingDto.bookingDate,
            createBookingDto.bookingTime,
        );

        const existingBooking =
            await this.bookingsRepository.findOne({
                where: {
                    serviceId:
                        createBookingDto.serviceId,
                    bookingDate:
                        createBookingDto.bookingDate,
                    bookingTime:
                        createBookingDto.bookingTime,
                },
            });

        if (existingBooking) {
            throw new ConflictException(
                'This service is already booked for the selected date and time',
            );
        }

        const booking =
            this.bookingsRepository.create({
                ...createBookingDto,
                customerEmail:
                    createBookingDto.customerEmail
                        .trim()
                        .toLowerCase(),
                status: BookingStatus.PENDING,
            });

        try {
            const savedBooking =
                await this.bookingsRepository.save(
                    booking,
                );

            return {
                success: true,
                message:
                    'Booking created successfully',
                data: savedBooking,
            };
        } catch (error) {
            if (
                error instanceof QueryFailedError &&
                this.isUniqueViolation(error)
            ) {
                throw new ConflictException(
                    'This service is already booked for the selected date and time',
                );
            }

            throw error;
        }
    }

    async findAll() {
        const bookings =
            await this.bookingsRepository.find({
                relations: {
                    service: true,
                },
                order: {
                    createdAt: 'DESC',
                },
            });

        return {
            success: true,
            data: bookings,
        };
    }

    async findOne(id: string) {
        const booking =
            await this.bookingsRepository.findOne({
                where: { id },
                relations: {
                    service: true,
                },
            });

        if (!booking) {
            throw new NotFoundException(
                'Booking not found',
            );
        }

        return {
            success: true,
            data: booking,
        };
    }

    async updateStatus(
        id: string,
        newStatus: BookingStatus,
    ) {
        const booking =
            await this.getBookingEntity(id);

        if (
            booking.status ===
            BookingStatus.CANCELLED
        ) {
            throw new BadRequestException(
                'Cancelled bookings cannot be updated',
            );
        }

        if (
            booking.status ===
            BookingStatus.COMPLETED
        ) {
            throw new BadRequestException(
                'Completed bookings cannot be updated',
            );
        }

        if (
            newStatus === BookingStatus.CANCELLED
        ) {
            booking.cancelledAt = new Date();
        }

        this.validateStatusTransition(
            booking.status,
            newStatus,
        );

        booking.status = newStatus;

        const updatedBooking =
            await this.bookingsRepository.save(
                booking,
            );

        return {
            success: true,
            message:
                'Booking status updated successfully',
            data: updatedBooking,
        };
    }

    async cancel(id: string) {
        const booking =
            await this.getBookingEntity(id);

        if (
            booking.status ===
            BookingStatus.CANCELLED
        ) {
            throw new BadRequestException(
                'Booking is already cancelled',
            );
        }

        if (
            booking.status ===
            BookingStatus.COMPLETED
        ) {
            throw new BadRequestException(
                'Completed bookings cannot be cancelled',
            );
        }

        booking.status =
            BookingStatus.CANCELLED;
        booking.cancelledAt = new Date();

        const cancelledBooking =
            await this.bookingsRepository.save(
                booking,
            );

        return {
            success: true,
            message:
                'Booking cancelled successfully',
            data: cancelledBooking,
        };
    }

    private async getBookingEntity(
        id: string,
    ) {
        const booking =
            await this.bookingsRepository.findOne({
                where: { id },
            });

        if (!booking) {
            throw new NotFoundException(
                'Booking not found',
            );
        }

        return booking;
    }

    private validateFutureBooking(
        bookingDate: string,
        bookingTime: string,
    ) {
        const bookingDateTime = new Date(
            `${bookingDate}T${bookingTime}:00`,
        );

        if (
            Number.isNaN(
                bookingDateTime.getTime(),
            )
        ) {
            throw new BadRequestException(
                'Invalid booking date or time',
            );
        }

        if (
            bookingDateTime.getTime() <=
            Date.now()
        ) {
            throw new BadRequestException(
                'Booking date and time must be in the future',
            );
        }
    }

    private validateStatusTransition(
        currentStatus: BookingStatus,
        newStatus: BookingStatus,
    ) {
        if (currentStatus === newStatus) {
            throw new BadRequestException(
                `Booking is already ${newStatus}`,
            );
        }

        const allowedTransitions: Record<
            BookingStatus,
            BookingStatus[]
        > = {
            [BookingStatus.PENDING]: [
                BookingStatus.CONFIRMED,
                BookingStatus.CANCELLED,
            ],

            [BookingStatus.CONFIRMED]: [
                BookingStatus.COMPLETED,
                BookingStatus.CANCELLED,
            ],

            [BookingStatus.CANCELLED]: [],

            [BookingStatus.COMPLETED]: [],
        };

        if (
            !allowedTransitions[
                currentStatus
            ].includes(newStatus)
        ) {
            throw new BadRequestException(
                `Cannot change booking status from ${currentStatus} to ${newStatus}`,
            );
        }
    }

    private isUniqueViolation(
        error: QueryFailedError,
    ) {
        const driverError = error.driverError as {
            code?: string;
        };

        return driverError.code === '23505';
    }
}