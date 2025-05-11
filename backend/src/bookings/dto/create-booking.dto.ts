import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  Min,
  Max,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceType } from '../../service-types/entities/service-type.entity';

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

export class CreateBookingDto {
  @IsString()
  mechanicId: string;

  @ValidateNested()
  @Type(() => LocationDto)
  serviceLocation: LocationDto;

  @IsDateString()
  scheduledTime: string;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsString()
  @IsOptional()
  issueDescription?: string;

  @IsNumber()
  @Min(1)
  estimatedDuration: number;

  @IsNumber()
  @Min(0)
  estimatedCost: number;
}
