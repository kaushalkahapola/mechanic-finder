// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;
}
