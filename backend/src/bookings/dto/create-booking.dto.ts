import {
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

class BookingServiceDto {
  @IsUUID()
  serviceTypeId: string;

  @IsNumber()
  @Min(1)
  estimatedDuration: number;

  @IsNumber()
  @Min(0)
  estimatedCost: number;
}

export class CreateBookingDto {
  @IsString()
  mechanicId: string;

  @ValidateNested()
  @Type(() => LocationDto)
  serviceLocation: LocationDto;

  @IsDateString()
  scheduledTime: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => BookingServiceDto)
  services: BookingServiceDto[];

  @IsString()
  @IsOptional()
  issueDescription?: string;
}
