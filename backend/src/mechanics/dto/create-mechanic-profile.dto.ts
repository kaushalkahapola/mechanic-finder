import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, Min, Max, ArrayMinSize } from 'class-validator';
import { MechanicService } from '../entities/mechanic.entity';

export class CreateMechanicProfileDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(MechanicService, { each: true })
  services: MechanicService[];

  @IsBoolean()
  availability: boolean;

  @IsArray()
  certifications?: string[];

  @IsInt()
  @Min(0)
  @Max(50)
  experienceYears: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  serviceRadiusKm?: number = 10;
} 
