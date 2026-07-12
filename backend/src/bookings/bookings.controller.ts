import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as AuthInterfaces from '../auth/interfaces/jwt-payload.interface';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Protected route
  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({
    default: {
      limit: 10,
      ttl: 60_000,
      blockDuration: 120_000,
    },
  })
  create(
    @Body()
    createBookingDto: CreateBookingDto,
    @CurrentUser()
    user: AuthInterfaces.JwtPayload,
  ) {
    createBookingDto.customerEmail = user.email;
    return this.bookingsService.create(createBookingDto);
  }

  // Protected route
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query()
    query: BookingQueryDto,
    @CurrentUser()
    user: AuthInterfaces.JwtPayload,
  ) {
    if (!user.email.endsWith('@en2h.com')) {
      query.customerEmail = user.email;
    }
    return this.bookingsService.findAll(query);
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
    updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, updateBookingStatusDto.status);
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
