import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customerName: string;

  @IsEmail()
  @MaxLength(150)
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  customerPhone: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  bookingDate: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'bookingTime must use HH:mm format, for example 14:30',
  })
  bookingTime: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
