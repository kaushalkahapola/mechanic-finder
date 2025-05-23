import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../user/entities/user.entity';
import { Mechanic } from '../mechanics/entities/mechanic.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { ServiceType } from '../service-types/entities/service-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Mechanic, Booking, ServiceType])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
