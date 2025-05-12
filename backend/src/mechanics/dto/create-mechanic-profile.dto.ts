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
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ServiceType } from '../../service-types/entities/service-type.entity';
import { Type } from 'class-transformer';

export class MechanicServiceDto {
  @IsString()
  serviceId: string;

  @IsNumber()
  @IsOptional()
  customPrice?: number;

  @IsBoolean()
  @IsOptional()
  isEmergencyAvailable?: boolean;
}

export class CreateMechanicProfileDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MechanicServiceDto)
  services: MechanicServiceDto[];

  @IsNumber()
  experienceYears: number;

  @IsArray()
  @IsString({ each: true })
  certifications: string[];

  @IsNumber()
  @IsOptional()
  serviceRadiusKm?: number;

  @IsBoolean()
  @IsOptional()
  emergencyAvailable?: boolean;
}
