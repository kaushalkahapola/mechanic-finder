import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  Min,
  Max,
  ArrayMinSize,
  IsString,
  IsUUID,
} from 'class-validator';
import { ServiceType } from '../../service-types/entities/service-type.entity';

export class CreateMechanicProfileDto {
  @IsArray()
  @IsUUID('4', { each: true })
  services: string[];

  @IsBoolean()
  availability: boolean;

  @IsArray()
  @IsString({ each: true })
  certifications: string[];

  @IsNumber()
  @Min(0)
  experienceYears: number;

  @IsNumber()
  @Min(0)
  serviceRadiusKm: number;

  @IsBoolean()
  emergencyAvailable: boolean;
}
