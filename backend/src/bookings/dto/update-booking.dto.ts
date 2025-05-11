import { IsEnum, IsString, IsNumber, Min, ValidateIf } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ValidateIf(o => o.status === BookingStatus.CANCELED)
  @IsString()
  cancellationReason?: string;

  @ValidateIf(o => o.status === BookingStatus.COMPLETED)
  @IsNumber()
  @Min(1)
  actualDuration?: number;

  @ValidateIf(o => o.status === BookingStatus.COMPLETED)
  @IsNumber()
  @Min(0)
  finalCost?: number;
} 
