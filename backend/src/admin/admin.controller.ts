import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { User } from '../user/entities/user.entity';
import { Mechanic } from '../mechanics/entities/mechanic.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async findAllUsers(@Request() req): Promise<User[]> {
    return this.adminService.findAllUsers(req.user.sub);
  }

  @Get('mechanics')
  async findAllMechanics(@Request() req): Promise<Mechanic[]> {
    return this.adminService.findAllMechanics(req.user.sub);
  }

  @Get('bookings')
  async findAllBookings(@Request() req): Promise<Booking[]> {
    return this.adminService.findAllBookings(req.user.sub);
  }
}
