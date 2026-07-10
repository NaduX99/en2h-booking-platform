import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
export class BookingsController {
    constructor(
        private readonly bookingsService:
            BookingsService,
    ) { }

    // Public route
    @Post()
    create(
        @Body()
        createBookingDto: CreateBookingDto,
    ) {
        return this.bookingsService.create(
            createBookingDto,
        );
    }

    // Protected route
    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.bookingsService.findAll();
    }

    // Protected route
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(
        @Param('id', ParseUUIDPipe)
        id: string,
    ) {
        return this.bookingsService.findOne(id);
    }

    // Protected route
    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(
        @Param('id', ParseUUIDPipe)
        id: string,

        @Body()
        updateBookingStatusDto:
            UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateStatus(
            id,
            updateBookingStatusDto.status,
        );
    }

    // Protected route
    @Patch(':id/cancel')
    @UseGuards(JwtAuthGuard)
    cancel(
        @Param('id', ParseUUIDPipe)
        id: string,
    ) {
        return this.bookingsService.cancel(id);
    }
}