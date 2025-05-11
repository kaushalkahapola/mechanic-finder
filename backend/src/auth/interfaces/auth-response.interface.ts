import { User } from '../../user/entities/user.entity';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
} 
