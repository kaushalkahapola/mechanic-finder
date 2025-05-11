import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
} 
