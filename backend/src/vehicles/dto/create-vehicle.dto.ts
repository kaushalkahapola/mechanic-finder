import { IsString, IsInt, IsOptional, Length, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsString()
  @IsOptional()
  @Length(17, 17)
  vin?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  mileage?: number;
}
